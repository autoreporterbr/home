import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Vídeos Automotivos',
  description: 'Confira os últimos lançamentos e testes em vídeo do Auto Repórter.',
}

export const dynamic = 'force-dynamic'

export default async function VideosPage() {
  let videos: any[] = []
  try {
    videos = await prisma.video.findMany({
      orderBy: { publishedAt: 'desc' },
    })
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error)
  }

  return (
    <div>
      <Header />
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="section-header">
          <div className="section-header-bar" />
          <h1 className="text-3xl font-black uppercase tracking-tight">Vídeos</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {videos.map((v) => (
            <div key={v.id} className="admin-card !p-0 overflow-hidden group">
               <div className="aspect-video bg-black relative">
                 <img src={v.thumbnailUrl || `https://img.youtube.com/vi/${getYouTubeID(v.youtubeUrl)}/hqdefault.jpg`} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" alt={v.title} />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-yellow-500 text-black rounded-full flex items-center justify-center text-2xl shadow-xl transform group-hover:scale-110 transition-transform">
                      ▶
                    </div>
                 </div>
               </div>
               <div className="p-4">
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{v.title}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-black">
                     Assistir no YouTube →
                  </p>
               </div>
            </div>
          ))}
          {videos.length === 0 && (
             <SampleVideos />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function SampleVideos() {
   const samples = [
     { id: '1', title: 'Testamos o Novo Toyota Corolla Cross 2025: O que mudou?', url: 'https://youtube.com/watch?v=xyz' },
     { id: '2', title: 'Top 5 SUVs mais econômicos do Brasil em 2024', url: 'https://youtube.com/watch?v=abc' },
     { id: '3', title: 'Como funciona a tecnologia híbrida da Stellantis?', url: 'https://youtube.com/watch?v=123' },
   ]
   return (
     <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {samples.map(v => (
          <div key={v.id} className="admin-card !p-0 overflow-hidden group cursor-pointer opacity-70">
            <div className="aspect-video bg-gray-200 flex items-center justify-center text-4xl">
              🎞️
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg leading-tight mb-2">{v.title}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Em Breve no canal</p>
            </div>
          </div>
       ))}
     </div>
   )
}
