'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Slide {
  id: string
  title: string
  subtitle?: string | null
  slug: string
  imageUrl?: string | null
  editoria: string
  publishedAt?: Date | null
}

interface HeroSlideshowProps {
  slides: Slide[]
}

const EDITORIA_LABELS: Record<string, string> = {
  noticias: 'Notícias',
  avaliacoes: 'Avaliações',
  colunas: 'Colunas',
  videos: 'Vídeos',
}

const defaultPlaceholders = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600&q=80',
]

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const displaySlides = slides.length > 0 ? slides : [
    {
      id: '1',
      title: 'Bem-vindo ao Auto Repórter',
      subtitle: 'Notícias, avaliações e rankings do mundo automotivo brasileiro com imparcialidade e qualidade jornalística.',
      slug: '/',
      imageUrl: defaultPlaceholders[0],
      editoria: 'noticias',
      publishedAt: new Date(),
    },
    {
      id: '2',
      title: 'Ranking dos Melhores Carros do Brasil',
      subtitle: 'Confira nossa análise completa com 8 critérios de avaliação para encontrar o melhor automóvel da sua categoria.',
      slug: '/ranking',
      imageUrl: defaultPlaceholders[1],
      editoria: 'avaliacoes',
      publishedAt: new Date(),
    },
    {
      id: '3',
      title: 'Avaliações Imparciais e Completas',
      subtitle: 'Testamos os carros mais vendidos do mercado brasileiro para te ajudar a fazer a melhor escolha.',
      slug: '/avaliacoes',
      imageUrl: defaultPlaceholders[2],
      editoria: 'avaliacoes',
      publishedAt: new Date(),
    },
  ]

  const goTo = useCallback((index: number) => {
    if (isAnimating || index === current) return
    setIsAnimating(true)
    setCurrent(index)
    setTimeout(() => setIsAnimating(false), 800)
  }, [isAnimating, current])

  const goNext = useCallback(() => {
    goTo((current + 1) % displaySlides.length)
  }, [current, displaySlides.length, goTo])

  useEffect(() => {
    const timer = setInterval(goNext, 5500)
    return () => clearInterval(timer)
  }, [goNext])

  return (
    <div className="hero-slideshow" role="region" aria-label="Destaques">
      {displaySlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === current ? 'active' : ''}`}
          style={{ 
            opacity: index === current ? 1 : 0,
            zIndex: index === current ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          aria-hidden={index !== current}
        >
          <Image
            src={slide.imageUrl || defaultPlaceholders[index % defaultPlaceholders.length]}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div style={{ maxWidth: '900px' }}>
              <span className="hero-editoria-badge">
                {EDITORIA_LABELS[slide.editoria] || slide.editoria}
              </span>
              <h1 className="hero-title">{slide.title}</h1>
              {slide.subtitle && (
                <p className="hero-subtitle">{slide.subtitle}</p>
              )}
              <Link
                href={slide.slug.startsWith('/') ? slide.slug : `/${slide.editoria}/${slide.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1.25rem',
                  background: '#FFCB08',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s',
                }}
              >
                Leia mais →
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        right: '2rem',
        zIndex: 10,
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        {displaySlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            style={{
              width: index === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: index === current ? '#FFCB08' : 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      {['prev', 'next'].map(dir => (
        <button
          key={dir}
          onClick={() => dir === 'prev' 
            ? goTo((current - 1 + displaySlides.length) % displaySlides.length)
            : goNext()
          }
          style={{
            position: 'absolute',
            top: '50%',
            [dir === 'prev' ? 'left' : 'right']: '1rem',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          aria-label={dir === 'prev' ? 'Anterior' : 'Próximo'}
        >
          {dir === 'prev' ? '‹' : '›'}
        </button>
      ))}
    </div>
  )
}
