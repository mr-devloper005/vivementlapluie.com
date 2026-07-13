'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { LogIn, Menu, PlusCircle, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const navVars = {
    '--editable-nav-bg': '#fbfaf7',
    '--editable-nav-text': '#111111',
    '--editable-nav-active': '#1d1830',
    '--editable-nav-active-text': '#f6f3eb',
    '--editable-cta-bg': '#1d1830',
    '--editable-cta-text': '#f6f3eb',
    '--editable-search-bg': preset.colors.surface,
    '--editable-border': `${preset.colors.muted}22`,
    '--editable-container': '1440px',
  } as CSSProperties
  const navItems = useMemo(
    () =>
      SITE_CONFIG.tasks
        .filter((task) => task.enabled && task.key !== 'profile')
        .slice(0, 5)
        .map((task) => ({ label: task.label, href: task.route })),
    []
  )

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-2xl">
      <div className="editable-dark-grid border-b border-white/10 bg-[#1d1830] text-[#f6f3eb]">
        <div className="mx-auto flex min-h-14 max-w-[var(--editable-container)] items-center justify-center px-4 text-center text-sm font-black sm:px-6 lg:px-8">
          <span>Discover image-led publishing, and premium reading paths.</span>
          <Link href="/login" className="ml-3 underline underline-offset-4">Start a conversation</Link>
        </div>
      </div>

      <nav className="mx-auto flex min-h-[92px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-transform group-hover:-rotate-2">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="block max-w-[220px] truncate text-lg font-black tracking-[-0.04em]">{SITE_CONFIG.name}</span>
            <span className="block max-w-[220px] truncate text-[11px] font-black uppercase tracking-[0.18em] opacity-55">{globalContent.nav?.tagline || SITE_CONFIG.tagline}</span>
          </span>
        </Link>

        
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link href="/search" className="hidden rounded-full p-2.5 transition hover:bg-black/5 lg:inline-flex" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/contact" className="hidden px-4 py-2.5 text-sm font-black lg:inline-flex">Request a feature</Link>
          {session ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-xl bg-[var(--editable-cta-bg)] px-5 py-3 text-sm font-black text-[var(--editable-cta-text)] shadow-sm md:inline-flex"><PlusCircle className="h-4 w-4" /> Publish</Link>
              <button type="button" onClick={logout} className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-black hover:bg-black/5 md:inline-flex">Logout</button>
            </>
          ) : (
            <>
              <Link href="/signup" className="hidden items-center gap-2 rounded-xl bg-[var(--editable-cta-bg)] px-5 py-3 text-sm font-black text-[var(--editable-cta-text)] shadow-sm md:inline-flex">Start browsing</Link>
              <Link href="/login" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-black hover:bg-black/5 lg:inline-flex"><LogIn className="h-4 w-4" /> Sign in</Link>
             
            </>
          )}
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-[var(--editable-border)] bg-white p-2 lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4 flex rounded-2xl border border-[var(--editable-border)] bg-[var(--editable-search-bg)] px-3 py-2">
            <Search className="mt-1 h-4 w-4 opacity-55" />
            <input name="q" type="search" placeholder="Search posts" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
          </form>
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'Search', href: '/search' }, { label: 'Contact', href: '/contact' }, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item, index) => (
              <Link key={`${item.href}-${item.label}-${index}`} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-black">
                {item.label}
              </Link>
            ))}
            {session ? <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-left text-sm font-black">Logout</button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
