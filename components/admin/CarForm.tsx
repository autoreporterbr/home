'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CarFormProps {
  initialData?: any
  isEditing?: boolean
}

const CATEGORIES = [
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

const CRITERIA = [
  { id: 'acabamento', label: 'Acabamento' },
  { id: 'infotenimento', label: 'Infotenimento' },
  { id: 'espacoInterno', label: 'Espaço Interno' },
  { id: 'portaMalas', label: 'Porta-malas' },
  { id: 'desempenho', label: 'Desempenho' },
  { id: 'dirigibilidade', label: 'Dirigibilidade' },
  { id: 'conforto', label: 'Conforto' },
  { id: 'consumo', label: 'Consumo' },
]

export default function CarForm({ initialData, isEditing = false }: CarFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    category: initialData?.category || 'hatch',
    imageUrl: initialData?.imageUrl || '',
    reviewSlug: initialData?.reviewSlug || '',
    acabamento: initialData?.acabamento || 0,
    infotenimento: initialData?.infotenimento || 0,
    espacoInterno: initialData?.espacoInterno || 0,
    portaMalas: initialData?.portaMalas || 0,
    desempenho: initialData?.desempenho || 0,
    dirigibilidade: initialData?.dirigibilidade || 0,
    conforto: initialData?.conforto || 0,
    consumo: initialData?.consumo || 0,
  })

  const calculateAverage = () => {
    const sum = CRITERIA.reduce((acc, c) => acc + (formData as any)[c.id], 0)
    return (sum / CRITERIA.length).toFixed(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditing ? `/api/cars/${initialData.id}` : '/api/cars'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/ranking')
        router.refresh()
      } else {
        alert('Erro ao salvar avaliação.')
      }
    } catch (err) {
      alert('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b pb-2">Identificação do Veículo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Marca</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  required
                  placeholder="Ex: Toyota"
                />
              </div>
              <div>
                <label className="form-label">Modelo</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  required
                  placeholder="Ex: Corolla Cross"
                />
              </div>
              <div>
                <label className="form-label">Ano</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Categoria</label>
                <select
                  className="form-input"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h2 className="text-sm font-black uppercase tracking-widest leading-none">Critérios de Avaliação (0-10)</h2>
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Nota Geral:</span>
                 <span className="text-2xl font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg">
                   {calculateAverage()}
                 </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              {CRITERIA.map(c => (
                <div key={c.id}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="form-label mb-0">{c.label}</label>
                    <span className="text-sm font-black">{(formData as any)[c.id]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    value={(formData as any)[c.id]}
                    onChange={e => setFormData({ ...formData, [c.id]: parseFloat(e.target.value) })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="admin-card">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b pb-2">Mídia e Link</h2>
            <div className="space-y-4">
               <div>
                <label className="form-label">URL da Foto</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/carro.jpg"
                />
              </div>
              <div>
                <label className="form-label">Link para Avaliação</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.reviewSlug}
                  onChange={e => setFormData({ ...formData, reviewSlug: e.target.value })}
                  placeholder="slug-da-materia-completa"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-base shadow-lg shadow-yellow-200"
          >
            {loading ? 'Salvando...' : isEditing ? 'ATUALIZAR VEÍCULO' : 'ADICIONAR AO RANKING'}
          </button>
        </div>
      </div>
    </form>
  )
}
