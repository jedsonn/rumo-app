import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Rumo</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Set your direction. Track your goals. Celebrate your wins.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3">
              Get Started Free
            </Link>
            <Link href="/auth/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Track Goals</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Organize personal and professional goals across 1, 3, and 5-year horizons.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Count Blessings</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Practice gratitude by recording what you're thankful for each day.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Earn Rewards</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Link rewards to goals and celebrate your achievements.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-500 dark:text-slate-400 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-5 h-5 rounded gradient-bg flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            <span className="gradient-text font-medium">Rumo</span>
          </div>
          <p>Set your direction</p>
        </footer>
      </div>
    </main>
  )
}
