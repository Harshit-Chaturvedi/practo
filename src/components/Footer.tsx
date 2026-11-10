import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75z" />
                </svg>
              </div>
              <span className="font-heading font-bold text-white">Practo for Animals</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Helping pet parents and animal caregivers find trusted veterinary care, boarding, and animal services.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm hover:text-white transition-colors">Find Care</Link></li>
              <li><Link to="/learn" className="text-sm hover:text-white transition-colors">AI Course</Link></li>
              <li><Link to="/#list-business" className="text-sm hover:text-white transition-colors">List Your Business</Link></li>
              <li><Link to="/carousel" className="text-sm hover:text-white transition-colors">Content Samples</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link to="/workflow" className="text-sm hover:text-white transition-colors">Workflow</Link></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Partner with us</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            &copy; 2026 Practo for Animals. All rights reserved.
          </p>
          <p className="text-sm text-white/50 flex items-center gap-1">
            Made with <Heart size={14} className="text-red-emergency" fill="currentColor" /> for animals everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
