export function isAnimationAllowed(): boolean {
  if (typeof window === 'undefined') return false
  if (!('IntersectionObserver' in window)) return false
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
  if (window.matchMedia?.('print').matches) return false
  if (navigator.webdriver) return false
  return true
}
