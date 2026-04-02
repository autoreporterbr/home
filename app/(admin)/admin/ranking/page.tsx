import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminRankingList() {
  const cars = await prisma.car.findMany({
    orderBy: { overallScore: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-black">GERENCIAR RANKING</h1>
        <Link href="/admin/ranking/novo" className="btn-primary">
          <span>+</span> Avaliar Novo Carro
        </Link>
      </div>

      <div className="admin-card overflow-hidden !p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Modelo</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Categoria</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Nota Geral</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-sm text-black">{car.brand} {car.model}</div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono mt-1">{car.year}</div>
                </td>
                <td className="p-4 text-xs text-gray-600 uppercase tracking-tighter">{car.category.replace('_', ' ')}</td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-yellow-400 text-black font-black text-xs px-2 py-1 rounded">
                    {car.overallScore.toFixed(1)}
                  </span>
                </td>
                <td className="p-4 text-right">
                   <div className="flex justify-end gap-2 text-xs font-bold">
                     <button className="text-blue-600 hover:underline">EDITAR</button>
                     <button className="text-red-600 hover:underline">EXCLUIR</button>
                   </div>
                </td>
              </tr>
            ))}
            {cars.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400 italic">
                  Nenhum veículo avaliado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
