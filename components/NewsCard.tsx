'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NewsCardProps {
  id: string
  title: string
  subtitle?: string | null
  slug: string
  imageUrl?: string | null
  editoria: string
  publishedAt?: Date | string | null
  delay?: number
}

const EDITORIA_LABELS: Record<string, string> = {
  noticias: 'Notícias',
  avaliacoes: 'Avaliações',
  colunas: 'Colunas',
  videos: 'Vídeos',
}

function formatDate(date?: Date | string | null) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function NewsCard({ id, title, subtitle, slug, imageUrl, editoria, publishedAt, delay = 0 }: NewsCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (ref.current) {
              ref.current.style.opacity = '1'
              ref.current.style.transform = 'translateY(0)'
            }
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  const href = `/${editoria}/${slug}`

  return (
    <div
      ref={ref}
      style={{ 
        opacity: 0, 
        transform: 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="news-card">
          <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
            <Image
              src={imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=70'}
              alt={title}
              fill
              className="news-card-img object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="news-card-body">
            <div className="news-card-editoria">{EDITORIA_LABELS[editoria] || editoria}</div>
            <h3 className="news-card-title">{title}</h3>
            {subtitle && (
              <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {subtitle}
              </p>
            )}
            <p className="news-card-date">{formatDate(publishedAt)}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
