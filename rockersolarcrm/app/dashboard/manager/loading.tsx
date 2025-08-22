"use client"

export default function ManagerLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1F1F1E" }}>
      {/* Header Skeleton */}
      <header
        className="p-6 border-b"
        style={{
          background: `linear-gradient(135deg, #1F1F1E 0%, #2A2A28 100%)`,
          borderColor: "#888886",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-700 rounded animate-pulse" />
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
              <div>
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse mb-1" />
                <div className="h-3 w-16 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Key Metrics Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-32 bg-gray-700 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border"
                style={{
                  background: `linear-gradient(135deg, #F4F4F1 0%, #FFFFFF 100%)`,
                  borderColor: "#D9D9D9",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg animate-pulse" />
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-gray-300 rounded animate-pulse mb-1" />
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-300 rounded animate-pulse mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Team Overview Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-48 bg-gray-300 rounded animate-pulse" />
                <div className="h-10 w-24 bg-gray-300 rounded animate-pulse" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
                      <div>
                        <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-1" />
                        <div className="h-3 w-24 bg-gray-300 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 w-16 bg-gray-300 rounded animate-pulse mb-1" />
                      <div className="h-3 w-12 bg-gray-300 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border"
                style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}
              >
                <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
                        <div className="h-3 w-16 bg-gray-300 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-8 bg-gray-300 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border"
              style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}
            >
              <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-3 rounded-lg"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-48 bg-gray-300 rounded animate-pulse mb-1" />
                      <div className="h-3 w-24 bg-gray-300 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
