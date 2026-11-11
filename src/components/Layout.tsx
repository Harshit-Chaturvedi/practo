import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const isCarouselPage = location.pathname === '/carousel'

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const attemptScroll = (attempts = 0) => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else if (attempts < 8) {
          setTimeout(() => attemptScroll(attempts + 1), 60)
        }
      }
      attemptScroll()
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [location.pathname, location.hash])

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
