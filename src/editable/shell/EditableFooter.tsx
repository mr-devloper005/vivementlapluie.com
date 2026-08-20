'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = { '--editable-footer-bg': '#1d1830', '--editable-footer-text': '#f6f3eb' } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile')
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer style={footerVars} className="mt-16 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <section className="editable-gradient-hero border-t border-black/5 px-4 py-20 text-[#1d1830] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px] text-center">
          <h2 className="text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">Start exploring the next visual story.</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#1d1830]/76">Move through editorials, guides, and image-led posts in one polished browsing experience.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/image" className="inline-flex items-center gap-2 rounded-xl bg-[#1d1830] px-7 py-3.5 text-sm font-black text-[#f6f3eb]">Explore visuals</Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-[#1d1830]">Contact us <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <div className="editable-dark-grid border-t border-white/10">
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
              <span className="text-lg font-black tracking-[-0.04em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/68">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-white/48">{globalContent.footer?.bottomNote}</p>
          </div>

          <div>
            <h3 className="text-sm font-black">Explore</h3>
            <div className="mt-4 grid gap-3">
              {taskLinks.map((task) => (
                <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-bold text-white/72 hover:text-white">
                  {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black">Studio</h3>
            <div className="mt-4 grid gap-3">
              {[
                ['About', '/about'],
                ['Contact', '/contact'],
                ['Search', '/search'],
                ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
              ].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm font-bold text-white/72 hover:text-white">{label}</Link>
              ))}
              {session ? <button type="button" onClick={logout} className="text-left text-sm font-bold text-white/72 hover:text-white">Logout</button> : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black">Notes</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/68">
              <p>Image-led discovery for readers who prefer atmosphere, clarity, and strong editorial structure.</p>
              <p>Every route stays live while the front-end presentation shifts into a more premium rhythm.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs font-bold text-white/45">
        © {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
