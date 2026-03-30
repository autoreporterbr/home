'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ 
                color: 'white', 
                fontSize: '1.25rem', 
                fontWeight: 900,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase'
              }}>
                auto<span style={{ color: '#FFCB08' }}>repórter</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#888', marginBottom: '1rem' }}>
              O portal de notícias automotivas mais completo do Brasil. Notícias, avaliações imparciais, ranking de modelos e muito mais.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['Instagram', 'YouTube', 'Twitter'].map(sn => (
                <a key={sn} href="#" style={{
                  background: '#222',
                  color: '#aaa',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#FFCB08'; (e.target as HTMLElement).style.color = '#000'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = '#222'; (e.target as HTMLElement).style.color = '#aaa'; }}
                >
                  {sn}
                </a>
              ))}
            </div>
          </div>

          {/* Editorias */}
          <div>
            <h4 style={{ color: '#FFCB08', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Editorias
            </h4>
            {[
              { label: 'Notícias', href: '/noticias' },
              { label: 'Avaliações', href: '/avaliacoes' },
              { label: 'Colunas', href: '/colunas' },
              { label: 'Vídeos', href: '/videos' },
              { label: 'Ranking', href: '/ranking' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{
                display: 'block',
                color: '#888',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#FFCB08'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#888'}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Categorias */}
          <div>
            <h4 style={{ color: '#FFCB08', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Categorias
            </h4>
            {['Hatches', 'Sedans', 'SUVs Compactos', 'SUVs Médios', 'Pick-ups', 'Elétricos', 'Híbridos'].map(cat => (
              <Link key={cat} href={`/ranking?cat=${cat.toLowerCase()}`} style={{
                display: 'block', color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem', textDecoration: 'none', transition: 'color 0.2s'
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#FFCB08'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#888'}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Contato */}
          <div>
            <h4 style={{ color: '#FFCB08', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Contato
            </h4>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              📧 contato@autoreporter.com.br
            </p>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Por Douglas Lemos
            </p>
            <Link href="/quem-somos" style={{ color: '#aaa', fontSize: '0.85rem', textDecoration: 'none' }}>
              Quem Somos →
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #222', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#555', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Auto Repórter — Por Douglas Lemos. Todos os direitos reservados.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Política de Privacidade', 'Termos de Uso'].map(item => (
              <a key={item} href="#" style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none' }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
