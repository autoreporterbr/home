export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded w-32" />
          <div className="h-10 bg-gray-200 rounded w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="h-96 bg-gray-200 rounded-xl" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}
