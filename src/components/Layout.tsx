import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const isCarouselPage = location.pathname === '/carousel'

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className={`flex-1 ${isCarouselPage ? '' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
