import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-6 min-w-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
