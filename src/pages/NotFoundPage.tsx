import { Link } from 'react-router-dom'
import { Home, Compass, PawPrint } from 'lucide-react'
import { Container, Button, Badge } from '@/components/ui'
import SEO from '@/components/SEO'

export default function NotFoundPage() {
  return (
    <main className="bg-cream min-h-[70vh] flex items-center justify-center py-16 sm:py-24">
      <SEO
        title="404 — Page Not Found | Practo for Animals"
        description="The page you are looking for doesn't exist, has been moved, or is temporarily unavailable. Return to Practo for Animals verified veterinary directory."
      />
      <Container size="narrow" className="text-center">
        {/* PawPrint Icon with badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface border-2 border-teal/20 flex items-center justify-center mx-auto mb-6 text-teal shadow-xs">
          <PawPrint size={36} className="text-teal" aria-hidden="true" />
        </div>

        <Badge variant="teal" className="mb-4">
          Error 404
        </Badge>

        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Page Not Found
        </h1>

        <p className="mt-4 text-text-muted text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link to="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Home size={18} />}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Compass size={18} />}
              className="w-full sm:w-auto"
            >
              Explore the Directory
            </Button>
          </Link>
        </div>
      </Container>
    </main>
  )
}
