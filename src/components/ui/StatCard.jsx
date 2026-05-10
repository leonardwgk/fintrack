export default function StatCard({ label, value, sub, accent = 'gray', loading = false }) {
  const accents = {
    gray:   'bg-white border-gray-100',
    blue:   'bg-blue-50 border-blue-100',
    green:  'bg-green-50 border-green-100',
    red:    'bg-red-50 border-red-100',
    purple: 'bg-purple-50 border-purple-100',
  }
  const textAccents = {
    gray:   'text-gray-900',
    blue:   'text-blue-700',
    green:  'text-green-700',
    red:    'text-red-600',
    purple: 'text-purple-700',
  }

  return (
    <div className={`rounded-2xl border p-5 ${accents[accent]}`}>
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      {loading ? (
        <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
      ) : (
        <p className={`text-2xl font-semibold tracking-tight ${textAccents[accent]}`}>{value}</p>
      )}
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
