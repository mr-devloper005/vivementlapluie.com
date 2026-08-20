import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f6f3eb] px-4 py-6 text-[#1d1830] sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[1440px]">
          <div className="editable-gradient-hero rounded-[2.2rem] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#7f2020]">{pagesContent.about.badge}</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">About {SITE_CONFIG.name}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#1d1830]/78">{pagesContent.about.description}</p>
          </div>
        </section>
        <section className="mx-auto mt-10 grid max-w-[1180px] gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-[#1d1830]/10 bg-[#fffdf9] p-8 shadow-[0_20px_60px_rgba(20,14,35,0.08)] lg:p-12">
            <div className="space-y-4 text-lg leading-8 text-[#625a6f]">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="space-y-4">
            {pagesContent.about.values.map((value) => (
              <div key={value.title} className="rounded-[1.8rem] border border-[#1d1830]/10 bg-[#fffdf9] p-6 shadow-[0_14px_36px_rgba(20,14,35,0.05)]">
                <h2 className="text-xl font-black tracking-[-0.04em]">{value.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#625a6f]">{value.description}</p>
              </div>
            ))}
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
