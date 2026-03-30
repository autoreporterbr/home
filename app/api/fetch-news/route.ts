import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { rewriteNews } from '@/lib/gemini'
import slugify from 'slugify'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sources = [
    { name: 'Stellantis', url: 'https://media.stellantis.com.br/br-pt/press', selector: '.press-release-item' },
    { name: 'VW News', url: 'https://www.vwnews.com.br/', selector: '.news-item' },
    { name: 'Toyota', url: 'https://www.toyotacomunica.com.br/', selector: 'article' },
    { name: 'GM', url: 'https://news.gm.com.br/newsroom.html', selector: '.newsroom-item' },
    { name: 'Ford', url: 'https://media.ford.com.br/content/fordmedia/fsa/br/pt.html', selector: '.news-item' },
    { name: 'Renault', url: 'https://imprensa.renault.com.br/', selector: '.post-item' },
    { name: 'Nissan', url: 'https://brazil.nissannews.com/pt-BR', selector: '.newsroom-item' },
  ]

  const fetchedArticles: any[] = []

  // Helper for deep scraping
  async function getFullContent(url: string, sourceName: string) {
    try {
      const { data } = await axios.get(url, { timeout: 10000 })
      const $ = cheerio.load(data)
      let body = ''
      let imageUrl = ''

      // Generic title and image extraction
      imageUrl = $('meta[property="og:image"]').attr('content') || 
                 $('meta[name="twitter:image"]').attr('content') || ''

      // Source specific body extraction
      if (sourceName === 'Stellantis') {
        body = $('.press-release-content').text().trim() || $('.article-body').text().trim()
      } else if (sourceName === 'VW News') {
        body = $('.news-content').text().trim() || $('.content').text().trim()
      } else {
        // Fallback: try to find the longest block of text
        body = $('article').text().trim() || $('.content').text().trim() || $('main').text().trim()
      }

      // If body is too short, fallback to meta description or generic paragraphs
      if (body.length < 200) {
        body = $('p').map((i, el) => $(el).text()).get().join('\n').substring(0, 5000)
      }

      return { body: body.substring(0, 5000), imageUrl }
    } catch (e) {
      console.error(`Error deep scraping ${url}:`, e)
      return null
    }
  }

  for (const source of sources) {
    try {
      const { data } = await axios.get(source.url, { timeout: 10000 })
      const $ = cheerio.load(data)
      let articlesToProcess: { title: string; link: string; summary: string; source: string }[] = []

      $(source.selector).each((i, el) => {
        if (i < 2) { // Limit to 2 per source to avoid timeouts
          const a = $(el).find('a').first()
          const title = $(el).find('h1, h2, h3, .title, .headline').first().text().trim()
          let link = a.attr('href') || ''
          
          if (link && !link.startsWith('http')) {
             const base = new URL(source.url).origin
             link = base + (link.startsWith('/') ? '' : '/') + link
          }

          if (title && link) {
            articlesToProcess.push({ 
              title, 
              link, 
              summary: $(el).find('p, .summary, .excerpt').first().text().trim(), 
              source: source.name 
            })
          }
        }
      })

      for (const art of articlesToProcess) {
        const exists = await prisma.article.findFirst({ where: { sourceUrl: art.link } })
        if (exists) continue

        const details = await getFullContent(art.link, source.name)
        const contentToRewrite = details?.body || `${art.title}\n\n${art.summary}`
        
        console.log(`Rewriting article from ${source.name}: ${art.title}`)
        const rewritten = await rewriteNews(contentToRewrite)

        if (rewritten) {
          const slug = slugify(rewritten.title, { lower: true, strict: true, locale: 'pt' })
          const article = await prisma.article.create({
            data: {
              title: rewritten.title,
              subtitle: rewritten.subtitle,
              slug: `${slug}-${Date.now()}`,
              content: rewritten.content,
              status: 'pending_review',
              source: art.source,
              sourceUrl: art.link,
              imageUrl: details?.imageUrl || null,
              imageCaption: `Divulgação / ${art.source}`,
              isAutoFetched: true,
              editoria: 'noticias',
            }
          })
          fetchedArticles.push(article)
        }
      }
    } catch (err) {
      console.error(`Error fetching from ${source.name}:`, err)
    }
  }

  return NextResponse.json({ success: true, count: fetchedArticles.length, articles: fetchedArticles })
}
