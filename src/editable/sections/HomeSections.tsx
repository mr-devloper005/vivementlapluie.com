import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function safePosts(posts: SitePost[]) {
  return posts.filter((post) => Boolean(post?.slug && post?.title))
}

function WordmarkRail({ labels }: { labels: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-8 py-8 text-center text-xl font-black tracking-[0.08em] text-[#1d1830]/75 sm:grid-cols-3 lg:grid-cols-6">
      {labels.map((label) => <span key={label}>{label}</span>)}
    </div>
  )
}

function DarkFeatureCard({ post, href, label, summary }: { post?: SitePost; href: string; label: string; summary: string }) {
  return (
    <Link href={href} className="group rounded-[1.8rem] bg-[#1d1830] p-6 text-[#f6f3eb] shadow-[0_24px_70px_rgba(18,14,31,0.18)] transition hover:-translate-y-1">
      <p className="text-3xl font-black leading-none text-[#ff7b34]">{label}</p>
      <h3 className="mt-4 text-[2rem] font-black leading-[1.02] tracking-[-0.05em]">{post?.title || summary}</h3>
      <p className="mt-4 text-base leading-8 text-[#f6f3eb]/70">{post ? getEditableExcerpt(post, 95) : summary}</p>
    </Link>
  )
}

function EditorialSplitCard({ post, href, title, eyebrow, accentClass = 'bg-[#ff6429]' }: { post?: SitePost; href: string; title: string; eyebrow: string; accentClass?: string }) {
  return (
    <Link href={href} className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_64px_rgba(20,14,35,0.09)] lg:grid-cols-[1.06fr_0.94fr]">
      <div className="p-8 sm:p-10">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ff6429]">{eyebrow}</p>
        <h3 className="mt-4 max-w-xl text-4xl font-black leading-[0.94] tracking-[-0.06em] text-[#1d1830] sm:text-5xl">{post?.title || title}</h3>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#625a6f]">{post ? getEditableExcerpt(post, 210) : title}</p>
        <span className="mt-8 inline-flex rounded-xl border border-[#1d1830]/12 px-5 py-3 text-sm font-black text-[#1d1830]">Explore this post</span>
      </div>
      <div className={`relative min-h-[320px] ${accentClass}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.45),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.08))]" />
        <div className="absolute inset-0 flex items-center justify-center p-10">
          {post ? (
            <div className="relative h-full w-full max-w-[360px] overflow-hidden rounded-[2rem] border border-white/35 bg-white/10 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur">
              <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full rounded-[1.5rem] object-cover" />
              <div className="absolute inset-3 rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.2))]" />
              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4">
                <div className="max-w-[70%] rounded-xl bg-white/88 px-4 py-3 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7f2020]">Image spotlight</p>
                  <p className="mt-1 line-clamp-2 text-sm font-black leading-tight text-[#1d1830]">{post.title}</p>
                </div>
                <div className="hidden h-20 w-16 overflow-hidden rounded-xl border border-white/70 shadow-sm sm:block">
                  <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

function DemandCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-[1.6rem] bg-transparent p-1">
      <h3 className="text-2xl font-black tracking-[-0.04em] text-[#1d1830]">{title}</h3>
      <p className="mt-3 text-lg leading-8 text-[#625a6f]">{body}</p>
    </article>
  )
}

function MetricCard({ value, label, mark }: { value: string; label: string; mark: string }) {
  return (
    <article className="min-h-[250px] rounded-[1.8rem] bg-[#26203b] p-8 text-white">
      <p className="text-7xl font-black leading-none tracking-[-0.07em]">{value}</p>
      <p className="mt-3 max-w-[14rem] text-2xl leading-tight text-white/92">{label}</p>
      <p className="mt-16 text-4xl font-black text-white/85">{mark}</p>
    </article>
  )
}

function CompactEditorialCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block rounded-[1.6rem] border border-[#1d1830]/10 bg-white p-5 shadow-[0_16px_42px_rgba(20,14,35,0.06)] transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#7f2020]">No. {String(index + 1).padStart(2, '0')}</span>
        <span className="rounded-full bg-[#f1e7dc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#1d1830]">Read</span>
      </div>
      <h3 className="mt-5 line-clamp-3 text-2xl font-black leading-[1.02] tracking-[-0.05em] text-[#1d1830]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#625a6f]">{getEditableExcerpt(post, 120)}</p>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.8rem] border border-[#1d1830]/10 bg-white shadow-[0_16px_42px_rgba(20,14,35,0.08)] transition hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-[#e7e2d7]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#869b7e]">Image first</p>
        <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.04em] text-[#1d1830]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const [first, second, third] = safePosts(posts)
  const heroTitle = pagesContent.home.hero.title.join(' ')
  return (
    <section className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="editable-gradient-hero overflow-hidden rounded-[2.2rem] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#7f2020]">{pagesContent.home.hero.badge}</p>
            <h1 className={`${dc.type.heroTitle} mt-5 text-[#1d1830]`}>{heroTitle}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-[#1d1830]/82">{pagesContent.home.hero.description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={pagesContent.home.hero.primaryCta.href || primaryRoute} className={dc.button.primary}>{pagesContent.home.hero.primaryCta.label}</Link>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-base font-black text-[#1d1830]">Learn more <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-[1180px] gap-5 lg:grid-cols-3">
            <DarkFeatureCard post={first} href={first ? postHref(primaryTask, first, primaryRoute) : primaryRoute} label="01" summary="Featured visual essays and cover-worthy moments." />
            <DarkFeatureCard post={second} href={second ? postHref(primaryTask, second, primaryRoute) : primaryRoute} label="02" summary="Gallery-led profiles with enough detail to keep reading." />
            <DarkFeatureCard post={third} href={third ? postHref(primaryTask, third, primaryRoute) : primaryRoute} label="03" summary="Curated resource lanes that stay fast to scan." />
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = safePosts(posts).slice(0, 6)
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <WordmarkRail labels={['','GALLERIES', 'EDITORIAL', 'COLLECTIONS', 'FEATURES', 'ARCHIVE']} />
        <div className="mx-auto mt-14 max-w-[1180px]">
          <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.06em] text-[#1d1830] sm:text-6xl">Built for how image lovers browse.</h2>
          <p className="mt-5 max-w-3xl text-xl leading-9 text-[#625a6f]">Jump from a standout cover to a compact index card, or a cleaner archive grid without losing the visual thread.</p>
           </div>
        <div className="mx-auto mt-14 max-w-[1180px]">
          <EditorialSplitCard post={railPosts[0]} href={railPosts[0] ? postHref(primaryTask, railPosts[0], primaryRoute) : primaryRoute} title="Large editorial panels keep the first post feeling important." eyebrow="Editorial system" accentClass="bg-[#221b37] editable-dark-grid" />
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = safePosts(posts).slice(1, 5)
  const gallery = safePosts(posts).slice(5, 9)
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <EditorialSplitCard post={featured[0]} href={featured[0] ? postHref(primaryTask, featured[0], primaryRoute) : primaryRoute} title="Large feature modules give the homepage a premium rhythm." eyebrow="Curated spotlight" accentClass="bg-[#ff6429]" />
        <EditorialSplitCard post={featured[1]} href={featured[1] ? postHref(primaryTask, featured[1], primaryRoute) : primaryRoute} title="Follow-up modules can still feel bold without repeating the same card style." eyebrow="Visual intelligence" accentClass="bg-[linear-gradient(135deg,#b896eb,#8f72dd)]" />

        <div className="pt-10">
          <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.06em] text-[#1d1830] sm:text-6xl">Built to meet different kinds of curiosity.</h2>
          <p className="mt-5 max-w-4xl text-xl leading-9 text-[#625a6f]">Some visitors want a quick visual hit. Others want a profile, a guide, a listing, or a longer read. The interface keeps each lane distinct without turning the site into a template grid.</p>
          <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            <DemandCard title="Visual stories" body="Large covers, image-first cards, and generous spacing keep gallery browsing immersive." />
            <DemandCard title="Resource flow" body="Bookmarks, PDFs, and listings remain easy to scan with clearer metadata and direct actions." />
            <DemandCard title="Compact discovery" body="Smaller editorial cards help readers keep moving without scrolling through repetitive blocks." />
            <DemandCard title="Search-first navigation" body="A clearer search route makes it easier to jump into the archive from any point in the journey." />
            <DemandCard title="Mobile polish" body="The structure stacks cleanly, keeps contrast strong, and avoids oversized empty zones on smaller screens." />
          </div>
        </div>

        {gallery.length ? (
          <div className="pt-14">
            <div className="rounded-[2rem] border border-[#1d1830]/10 bg-white px-6 py-8 shadow-[0_16px_42px_rgba(20,14,35,0.07)] sm:px-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#869b7e]">Varied cards</p>
                  <h2 className="mt-3 text-4xl font-black leading-[0.94] tracking-[-0.05em] text-[#1d1830]">One homepage, multiple ways to explore.</h2>
                </div>
                <Link href={primaryRoute} className="inline-flex items-center gap-2 text-sm font-black text-[#1d1830]">See all posts <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
                <ImageFirstCard post={gallery[0]} href={postHref(primaryTask, gallery[0], primaryRoute)} />
                {gallery.slice(1).map((post, index) => <CompactEditorialCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sectionPosts = timeSections.flatMap((section) => section.posts)
  const pool = safePosts(sectionPosts.length ? sectionPosts : posts).slice(0, 5)
  return (
    <>
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[980px] text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#7f2020]">Editorial principle</p>
          <h2 className="mt-5 text-4xl font-black leading-[1] tracking-[-0.05em] text-[#1d1830] sm:text-5xl lg:text-6xl">A strong front page should feel fast, distinct, and worth revisiting.</h2>
          </div>
      </section>

      <section className="editable-dark-grid px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl">One premium system for every section.</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-5">
            <MetricCard value="5" label="distinct card styles used across the site" mark="cover" />
            <MetricCard value="1" label="clean search route for all active content types" mark="index" />
            <MetricCard value="7" label="task pages kept live with refreshed layouts" mark="route" />
            <MetricCard value="24" label="archive posts displayed with stronger hierarchy" mark="grid" />
            <MetricCard value="∞" label="visual combinations from existing post data" mark="flow" />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#869b7e]">Search-first entry</p>
            <h2 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.06em] text-[#1d1830]">Move directly into the archive when you know what you want.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#625a6f]">Search by title, category, or content type and keep the same premium visual language while filtering through posts.</p>
            <form action="/search" className="mt-8 flex max-w-xl rounded-2xl border border-[#1d1830]/10 bg-white p-2 shadow-[0_12px_30px_rgba(20,14,35,0.06)]">
              <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold outline-none placeholder:text-[#625a6f]/65" />
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#1d1830] px-5 py-3 text-sm font-black text-[#f6f3eb]"><Search className="h-4 w-4" /> Search</button>
            </form>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pool.map((post, index) => <CompactEditorialCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return null
}
