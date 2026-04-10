/**
 * Privacy-friendly analytics using Plausible.
 * - No cookies, no personal data, GDPR compliant
 * - Self-hosted or cloud (plausible.io)
 * - Falls back gracefully if not configured (no errors)
 *
 * Setup: Add your Plausible domain to VITE_PLAUSIBLE_DOMAIN env var.
 * The script tag is injected dynamically only if configured.
 */

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined

// Plausible's custom event API
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void
  }
}

let initialized = false

/** Initialize Plausible script tag (call once on app startup) */
export function initAnalytics(): void {
  if (initialized || !PLAUSIBLE_DOMAIN) return
  initialized = true

  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = PLAUSIBLE_DOMAIN
  script.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(script)
}

/** Track a custom event. No-op if analytics not configured. */
export function trackEvent(
  event: string,
  props?: Record<string, string | number>
): void {
  window.plausible?.(event, props ? { props } : undefined)
}

// Pre-defined events for the app
export const analytics = {
  /** User completed a keyword scan */
  scanCompleted: (score: number) =>
    trackEvent('scan_completed', { score }),

  /** User triggered AI bullet rewrite */
  aiRewrite: () =>
    trackEvent('ai_rewrite'),

  /** User generated a cover letter */
  coverLetter: () =>
    trackEvent('cover_letter'),

  /** User exported their results */
  exported: (format: string) =>
    trackEvent('exported', { format }),

  /** User switched themes */
  themeChanged: (theme: string) =>
    trackEvent('theme_changed', { theme }),

  /** User used the copy AI prompt fallback */
  copyPrompt: (task: string) =>
    trackEvent('copy_prompt', { task }),
}
