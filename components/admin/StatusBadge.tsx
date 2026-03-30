export default function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    published: 'bg-green-100 text-green-700 border-green-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    pending_review: 'bg-amber-100 text-amber-700 border-amber-200',
  }
  const labels: any = {
    published: 'Publicado',
    draft: 'Rascunho',
    pending_review: 'Pendente',
  }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${styles[status] || styles.draft}`}>
      {labels[status] || status}
    </span>
  )
}
