import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-12">
        <div className="space-y-12">
          {/* Skeleton for Hero */}
          <div className="w-full h-[400px] md:h-[600px] bg-gray-100 rounded-2xl animate-pulse" />
          
          {/* Skeleton for Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
