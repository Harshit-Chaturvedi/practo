import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const LearnPage = lazy(() => import('./pages/LearnPage'))
const CarouselPage = lazy(() => import('./pages/CarouselPage'))
const WorkflowPage = lazy(() => import('./pages/WorkflowPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="animate-pulse text-teal font-heading text-xl">Loading...</div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/carousel" element={<CarouselPage />} />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
