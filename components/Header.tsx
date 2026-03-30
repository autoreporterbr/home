'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Início', href: '/' },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Avaliações', href: '/avaliacoes' },
  { label: 'Colunas', href: '/colunas' },
  { label: 'Vídeos', href: '/videos' },
  { label: 'Ranking', href: '/ranking' },
  { label: 'Quem Somos', href: '/quem-somos' },
]

const sampleTicker = [
  '🏎️ Novo lançamento no Salão do Automóvel de São Paulo gera expectativa',
  '⚡ Mercado de elétricos cresce 45% no Brasil em 2024',
  '🔧 Montadoras anunciam recall de 50 mil unidades no país',
  '🏆 Ranking: confira os carros mais vendidos do mês',
  '📈 Vendas de SUVs batem recorde histórico no primeiro trimestre',
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="site-header">
      {/* Breaking News Ticker */}
      <div style={{ background: '#FFCB08', padding: '0.35rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
          <span style={{ 
            background: '#000', 
            color: '#FFCB08', 
            fontSize: '0.6rem', 
            fontWeight: 900, 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            padding: '0.25rem 0.6rem',
            borderRadius: '2px',
            flexShrink: 0,
            marginRight: '1rem'
          }}>
            AO VIVO
          </span>
          <div className="ticker-wrapper" style={{ flex: 1, overflow: 'hidden' }}>
            <div className="ticker-content" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#000' }}>
              {sampleTicker.join('   •   ')}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {sampleTicker.join('   •   ')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" className="site-logo" style={{ display: 'block', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              color: 'white', 
              fontSize: '1.5rem', 
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase'
            }}>
              auto<span style={{ color: '#FFCB08' }}>repórter</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="show-mobile"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
          aria-label="Menu"
        >
          {[0,1,2].map(i => (
            <span key={i} style={{ 
              display: 'block', 
              width: '24px', 
              height: '2px', 
              background: mobileOpen && i === 1 ? 'transparent' : '#FFCB08',
              transition: 'all 0.3s',
              transform: mobileOpen ? (i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'none') : 'none'
            }} />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ 
          background: '#111', 
          padding: '1rem',
          borderTop: '1px solid #333'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              style={{ display: 'block', padding: '0.75rem 1rem', borderBottom: '1px solid #222' }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}
