import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardProvider } from '@/components/providers/DashboardProvider'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <DashboardProvider
      user={user}
      initialProfile={profile}
    >
      {children}
    </DashboardProvider>
  )
}
