'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'

interface ArticleFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    editoria: initialData?.editoria || 'noticias',
    status: initialData?.status || 'draft',
    imageUrl: initialData?.imageUrl || '',
    imageCaption: initialData?.imageCaption || '',
    isFeatured: initialData?.isFeatured || false,
    authorName: initialData?.authorName || 'Redação Auto Repórter',
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: initialData?.content || '<p>Comece a escrever aqui...</p>',
    editorProps: {
      attributes: {
        class: 'ProseMirror focus:outline-none min-h-[400px] p-4 border-2 border-gray-100 rounded-b-lg bg-white',
      },
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      content: editor?.getHTML(),
    }

    try {
      const url = isEditing ? `/api/articles/${initialData.id}` : '/api/articles'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/artigos')
        router.refresh()
      } else {
        alert('Erro ao salvar artigo.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro na conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <div className="space-y-4">
              <div>
                <label className="form-label">Título da Matéria</label>
                <input
                  type="text"
                  className="form-input text-lg font-bold"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Ex: Novo SUV elétrico chega ao Brasil com autonomia recorde"
                />
              </div>

              <div>
                <label className="form-label">Subtítulo (Lead)</label>
                <textarea
                  className="form-input h-24 resize-none"
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Um breve resumo da notícia para atrair o leitor"
                />
              </div>
            </div>
          </div>

          <div className="admin-card !p-0 overflow-hidden">
            <div className="bg-gray-50 p-2 border-b border-gray-100 flex gap-2 flex-wrap">
              <EditorButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')}>B</EditorButton>
              <EditorButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')}>I</EditorButton>
              <EditorButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })}>H2</EditorButton>
              <EditorButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')}>• Lista</EditorButton>
              <EditorButton onClick={() => {
                const url = window.prompt('URL do link:')
                if (url) editor?.chain().focus().setLink({ href: url }).run()
              }}>🔗 Link</EditorButton>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="space-y-6">
          <div className="admin-card">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b pb-2">Publicação</h2>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Status</label>
                <select 
                  className="form-input"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">Rascunho</option>
                  <option value="pending_review">Pendente de Revisão</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              <div>
                <label className="form-label">Editoria</label>
                <select 
                  className="form-input"
                  value={formData.editoria}
                  onChange={e => setFormData({ ...formData, editoria: e.target.value })}
                >
                  <option value="noticias">Notícias</option>
                  <option value="avaliacoes">Avaliações</option>
                  <option value="colunas">Colunas</option>
                  <option value="videos">Vídeos</option>
                </select>
              </div>

              <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 rounded-lg">
                <input 
                  type="checkbox" 
                  id="featured"
                  className="w-4 h-4 accent-yellow-500"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                <label htmlFor="featured" className="text-sm font-bold text-yellow-800 cursor-pointer">
                  DESTAQUE NA HOME
                </label>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b pb-2">Imagem de Capa</h2>
            <div className="space-y-4">
               <div>
                <label className="form-label">URL da Imagem</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>
              {formData.imageUrl && (
                <div className="aspect-video rounded-lg overflow-hidden border border-gray-100">
                  <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
              <div>
                <label className="form-label">Legenda da Foto</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  value={formData.imageCaption}
                  onChange={e => setFormData({ ...formData, imageCaption: e.target.value })}
                  placeholder="Ex: Novo motor V6 / Divulgação"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-base shadow-lg shadow-yellow-200"
          >
            {loading ? 'Salvando...' : isEditing ? 'ATUALIZAR MATÉRIA' : 'PUBLICAR MATÉRIA'}
          </button>
        </div>
      </div>
    </form>
  )
}

function EditorButton({ children, onClick, active }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
        active ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}
