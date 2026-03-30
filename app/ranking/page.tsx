import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'all', label: 'Todos' },
  { value: 'hatch', label: 'Hatches' },
  { value: 'sedan', label: 'Sedans' },
  { value: 'suv_compacto', label: 'SUVs Compactos' },
  { value: 'suv_medio', label: 'SUVs Médios' },
  { value: 'suv_grande', label: 'SUVs Grandes' },
  { value: 'pickup_compacta', label: 'Pick-ups Compactas' },
  { value: 'pickup_media', label: 'Pick-ups Médias' },
  { value: 'hibrido', label: 'Híbridos' },
  { value: 'eletrico', label: 'Elétricos' },
]

export default async function RankingPublicPage({ searchParams }: { searchParams: { cat?: string } }) {
  const selectedCat = searchParams.cat || 'all'
  
  const where: any = {}
  if (selectedCat !== 'all') where.category = selectedCat

  const cars = await prisma.car.findMany({
    where,
    orderBy: { overallScore: 'desc' },
  })

  return (
    <div>
      <Header />
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="section-header">
           <div className="section-header-bar" />
           <h1 className="text-3xl font-black uppercase tracking-tight">🏆 Ranking Auto Repórter</h1>
        </div>
        <p className="text-gray-500 max-w-2xl mt-4">
          Nossa metodologia exclusiva avalia 8 critérios fundamentais para determinar os melhores modelos do mercado brasileiro. 
          Confira abaixo o ranking atualizado por categoria.
        </p>

        {/* Category Tabs */}
        <div className="category-tabs mt-10">
          {CATEGORIES.map(cat => (
            <Link 
              key={cat.value} 
              href={`/ranking${cat.value === 'all' ? '' : `?cat=${cat.value}`}`}
              className={`category-tab ${selectedCat === cat.value ? 'active' : ''}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Ranking Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="ranking-table">
            <thead>
              <tr className="bg-black text-white uppercase text-[10px] tracking-widest font-black">
                <th className="p-5 text-center w-16">#</th>
                <th className="p-5">Modelo / Marca</th>
                <th className="p-5 text-center">Ano</th>
                <th className="p-5 text-center">Nota Geral</th>
                <th className="p-5 text-right w-32">Acabamento</th>
                <th className="p-5 text-right w-32">Consumo</th>
                <th className="p-5 text-right w-32">Desempenho</th>
                <th className="p-5 text-center w-32">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cars.map((car, i) => (
                <tr key={car.id} className={`ranking-position-${i + 1} hover:bg-yellow-50 transition-colors`}>
                  <td className="p-5 text-center">
                    <span className="text-lg font-black">{i + 1}º</span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                       <span className="font-black text-black text-lg uppercase leading-none">{car.brand} {car.model}</span>
                    </div>
                  </td>
                  <td className="p-5 text-center text-xs font-bold text-gray-400">
                    {car.year}
                  </td>
                  <td className="p-5 text-center">
                    <span className="score-badge text-lg px-4 py-2">{car.overallScore.toFixed(1)}</span>
                  </td>
                  <td className="p-5 text-right font-bold text-sm text-gray-700">{car.acabamento.toFixed(1)}</td>
                  <td className="p-5 text-right font-bold text-sm text-gray-700">{car.consumo.toFixed(1)}</td>
                  <td className="p-5 text-right font-bold text-sm text-gray-700">{car.desempenho.toFixed(1)}</td>
                  <td className="p-5 text-center">
                     <Link href={car.reviewSlug ? `/avaliacoes/${car.reviewSlug}` : "#"} className="text-[10px] font-black uppercase text-yellow-600 hover:text-black transition-colors underline underline-offset-4 decoration-2">
                       LER TESTE →
                     </Link>
                  </td>
                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-20 text-center text-gray-400 italic">
                    Nenhum veículo encontrado nesta categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ad Placeholder */}
        <div className="mt-12 ad-unit ad-banner">Publicidade</div>
      </main>
      <Footer />
    </div>
  )
}
