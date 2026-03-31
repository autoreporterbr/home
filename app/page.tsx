import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSlideshow from '@/components/HeroSlideshow'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'

export const revalidate = 60
export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const [featured, latest, avaliacoes, cars] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'published', isFeatured: true },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: { id: true, title: true, subtitle: true, slug: true, imageUrl: true, editoria: true, publishedAt: true },
      }),
      prisma.article.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 9,
        select: { id: true, title: true, subtitle: true, slug: true, imageUrl: true, editoria: true, publishedAt: true },
      }),
      prisma.article.findMany({
        where: { status: 'published', editoria: 'avaliacoes' },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: { id: true, title: true, subtitle: true, slug: true, imageUrl: true, editoria: true, publishedAt: true },
      }),
      prisma.car.findMany({
        orderBy: { overallScore: 'desc' },
        take: 5,
        select: { id: true, brand: true, model: true, year: true, category: true, overallScore: true },
      }),
    ])
    return { featured, latest, avaliacoes, cars }
  } catch {
    return { featured: [], latest: [], avaliacoes: [], cars: [] }
  }
}

export default async function HomePage() {
  const { featured, latest, avaliacoes, cars } = await getData()

  return (
    <div>
      <Header />
      
      <main>
        {/* Hero Slideshow */}
        <HeroSlideshow slides={featured} />

        {/* Ad Banner */}
        <div style={{ maxWidth: '1400px', margin: '1.5rem auto', padding: '0 1.5rem' }}>
          <div className="ad-unit ad-banner">Publicidade</div>
        </div>

        {/* Latest News */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div className="section-header">
            <div className="section-header-bar" />
            <h2>Últimas Notícias</h2>
            <Link href="/noticias" style={{ marginLeft: 'auto', color: '#888', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              Ver todas →
            </Link>
          </div>

          {latest.length === 0 ? (
            <SampleNewsGrid />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {latest.map((article, i) => (
                <NewsCard key={article.id} {...article} delay={i * 100} />
              ))}
            </div>
          )}
        </section>

        {/* Avaliações em destaque */}
        {(avaliacoes.length > 0 || true) && (
          <section style={{ background: '#f9f9f9', padding: '3rem 0' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
              <div className="section-header">
                <div className="section-header-bar" />
                <h2>Avaliações em Destaque</h2>
                <Link href="/avaliacoes" style={{ marginLeft: 'auto', color: '#888', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>
                  Ver todas →
                </Link>
              </div>
              {avaliacoes.length === 0 ? (
                <SampleAvaliacoes />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {avaliacoes.map((a, i) => <NewsCard key={a.id} {...a} delay={i * 100} />)}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Ranking Preview */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div className="section-header">
            <div className="section-header-bar" />
            <h2>🏆 Ranking Geral</h2>
            <Link href="/ranking" style={{ marginLeft: 'auto', color: '#888', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>
              Ver ranking completo →
            </Link>
          </div>

          {cars.length === 0 ? (
            <SampleRanking />
          ) : (
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Modelo</th>
                  <th>Categoria</th>
                  <th>Nota Geral</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car, i) => (
                  <tr key={car.id} className={`ranking-position-${i + 1}`}>
                    <td><strong>{i + 1}º</strong></td>
                    <td><strong>{car.brand} {car.model}</strong> <span style={{ color: '#888', fontSize: '0.8rem' }}>{car.year}</span></td>
                    <td style={{ color: '#666' }}>{car.category}</td>
                    <td><span className="score-badge">{car.overallScore.toFixed(1)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Bottom Ad */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
          <div className="ad-unit ad-banner">Publicidade</div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Sample components for empty state
function SampleNewsGrid() {
  const sampleNews = [
    { id: '1', title: 'Stellantis anuncia linha renovada do Argo e Cronos para 2025', subtitle: 'Modelos ganham nova central multimídia e recursos de conectividade atualizados', slug: '#', imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=70', editoria: 'noticias', publishedAt: new Date() },
    { id: '2', title: 'Toyota Corolla Cross Hybrid: consumo impressiona em teste urbano', subtitle: 'SUV compacto mostrou média de 18 km/l em percurso pela cidade de São Paulo', slug: '#', imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=70', editoria: 'avaliacoes', publishedAt: new Date() },
    { id: '3', title: 'Volkswagen revela planos de eletrificação para o mercado brasileiro', subtitle: 'Marca alemã deve lançar versões eletrificadas da linha T-Cross e Taos até 2026', slug: '#', imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=70', editoria: 'noticias', publishedAt: new Date() },
    { id: '4', title: 'GM confirma volta da Chevrolet Blazer ao Brasil em versão elétrica', subtitle: 'Modelo chega para concorrer com os principais SUVs elétricos do segmento premium', slug: '#', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=70', editoria: 'noticias', publishedAt: new Date() },
    { id: '5', title: 'Ford Bronco Sport: avaliamos o SUV aventureiro da montadora americana', subtitle: 'Modelo com tração 4x4 e vocação off-road é testado em diferentes terrenos', slug: '#', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=70', editoria: 'avaliacoes', publishedAt: new Date() },
    { id: '6', title: 'Renault Duster 2025 estreia com motor turbo e câmbio CVT', subtitle: 'Versão mais completa traz nova plataforma e pacote de tecnologias inéditas para o modelo', slug: '#', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=70', editoria: 'noticias', publishedAt: new Date() },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {sampleNews.map((n, i) => <NewsCard key={n.id} {...n} delay={i * 100} />)}
    </div>
  )
}

function SampleAvaliacoes() {
  const items = [
    { id: 'a1', title: 'Hyundai Creta 2025: o SUV compacto mais completo do Brasil?', subtitle: 'Testamos a versão top de linha com motor 1.0 turbo e câmbio automático de 7 velocidades', slug: '#', imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=70', editoria: 'avaliacoes', publishedAt: new Date() },
    { id: 'a2', title: 'Kwid Intense 2025: ainda um bom negócio na faixa de entrada?', subtitle: 'Avaliamos o hatch da Renault que foi o carro mais acessível do mercado por vários anos', slug: '#', imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=70', editoria: 'avaliacoes', publishedAt: new Date() },
    { id: 'a3', title: 'Fiat Pulse Drive: entre os melhores SUVs compactos da faixa', subtitle: 'Modelo da Fiat impressiona no espaço interno mas precisa melhorar no desempenho', slug: '#', imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=70', editoria: 'avaliacoes', publishedAt: new Date() },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {items.map((n, i) => <NewsCard key={n.id} {...n} delay={i * 100} />)}
    </div>
  )
}

function SampleRanking() {
  const items = [
    { pos: 1, brand: 'Toyota', model: 'Corolla Cross Hybrid', year: 2025, cat: 'SUV Compacto', score: 9.2 },
    { pos: 2, brand: 'Hyundai', model: 'Creta N Line', year: 2025, cat: 'SUV Compacto', score: 8.9 },
    { pos: 3, brand: 'Volkswagen', model: 'T-Cross Highline', year: 2025, cat: 'SUV Compacto', score: 8.7 },
    { pos: 4, brand: 'Renault', model: 'Duster Iconic', year: 2025, cat: 'SUV Compacto', score: 8.4 },
    { pos: 5, brand: 'Fiat', model: 'Pulse Impetus', year: 2025, cat: 'SUV Compacto', score: 8.1 },
  ]
  return (
    <table className="ranking-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Modelo</th>
          <th>Categoria</th>
          <th>Nota Geral</th>
        </tr>
      </thead>
      <tbody>
        {items.map(car => (
          <tr key={car.pos} className={`ranking-position-${car.pos}`}>
            <td><strong>{car.pos}º</strong></td>
            <td><strong>{car.brand} {car.model}</strong> <span style={{ color: '#888', fontSize: '0.8rem' }}>{car.year}</span></td>
            <td style={{ color: '#666' }}>{car.cat}</td>
            <td><span className="score-badge">{car.score}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
