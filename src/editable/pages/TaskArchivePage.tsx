import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, Building2, Camera, Download, FileText, Filter, Globe2, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || 'Open this post for the full details.'
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; badge: string; metric: string; submetric: string }> = {
  article: { icon: FileText, badge: 'Editorial', metric: 'Long reads', submetric: 'Built for spacious reading and strong cover cards.' },
  listing: { icon: Building2, badge: 'Directory', metric: 'Trusted listings', submetric: 'Company identity, location, and quick details stay visible.' },
  classified: { icon: Megaphone, badge: 'Notice board', metric: 'Fast offers', submetric: 'Direct metadata and action cues for time-sensitive posts.' },
  image: { icon: Camera, badge: 'Gallery', metric: 'Image-first browsing', submetric: 'The archive keeps visuals at the center of every row.' },
  sbm: { icon: Bookmark, badge: 'Collections', metric: 'Curated links', submetric: 'Bookmarks scan quickly without losing editorial polish.' },
  pdf: { icon: Download, badge: 'Library', metric: 'Useful documents', submetric: 'File context and summaries stay easy to scan.' },
  profile: { icon: UserRound, badge: 'Profiles', metric: 'Identity-led cards', submetric: 'People and entities feel memorable instead of generic.' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = {
    '--archive-bg': '#f6f3eb',
    '--archive-text': '#1d1830',
    '--archive-surface': '#fffdf9',
    '--archive-accent': preset.colors.accent,
  } as CSSProperties
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const heroPost = posts[0]
  const sidePosts = posts.slice(1, 4)

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="editable-gradient-hero overflow-hidden rounded-[2.2rem] px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--archive-accent)]">
                    <Icon className="h-4 w-4" /> {voice.eyebrow}
                  </div>
                  <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{voice.headline || `Browse ${label}`}</h1>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--archive-text)]/76">{voice.description}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/search" className="inline-flex rounded-xl px-5 py-3 text-sm font-black text-[#1d1830]">Search archive</Link>
                  </div>
                </div>

                <div className="grid gap-4 self-end lg:grid-cols-3">
                  <div className="rounded-[1.7rem] bg-[#1d1830] p-5 text-[#f6f3eb]">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff7b34]">{deck.badge}</p>
                    <h2 className="mt-4 text-3xl font-black leading-[1.02] tracking-[-0.05em]">{deck.metric}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/70">{deck.submetric}</p>
                  </div>
                  <div className="rounded-[1.7rem] bg-[#1d1830] p-5 text-[#f6f3eb]">
                    <p className="text-4xl font-black leading-none">{posts.length || 0}</p>
                    <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-white/72">posts on this page</p>
                  </div>
                  <div className="rounded-[1.7rem] bg-[#1d1830] p-5 text-[#f6f3eb]">
                    <p className="text-4xl font-black leading-none">{pagination.totalPages || 1}</p>
                    <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-white/72">archive pages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <form action={basePath} className="rounded-[1.8rem] border border-[#1d1830]/10 bg-white p-5 shadow-[0_16px_42px_rgba(20,14,35,0.06)]">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#625a6f]"><Filter className="h-4 w-4" /> {voice.filterLabel}</div>
                <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-xl border border-[#1d1830]/10 bg-white px-4 text-sm font-bold outline-none">
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="mt-3 h-12 w-full rounded-xl bg-[#1d1830] text-sm font-black text-[#f6f3eb]">Apply filters</button>
                <p className="mt-3 text-xs font-bold text-[#625a6f]">Showing: {categoryLabel}</p>
              </form>

              {sidePosts.map((post, index) => (
                <Link key={post.id || post.slug} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} className="block rounded-[1.6rem] border border-[#1d1830]/10 bg-white p-4 shadow-[0_12px_30px_rgba(20,14,35,0.05)] transition hover:-translate-y-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#869b7e]">Pick {index + 1}</p>
                  <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-[#625a6f]">{getSummary(post)}</p>
                </Link>
              ))}
            </aside>

            <div>
              {heroPost ? <FeatureArchiveCard task={task} post={heroPost} basePath={basePath} /> : null}

              {posts.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {posts.slice(heroPost ? 1 : 0).map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-[#1d1830]/14 bg-white/70 p-10 text-center">
                  <Search className="mx-auto h-8 w-8 opacity-45" />
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
                  <p className="mt-2 text-sm opacity-65">Try another category or refresh this page after publishing new content.</p>
                </div>
              )}

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="inline-flex items-center gap-2 rounded-xl border border-[#1d1830]/10 bg-white px-5 py-3 text-sm font-black"><ArrowLeft className="h-4 w-4" /> Previous</Link> : null}
                <span className="rounded-xl bg-[#1d1830] px-5 py-3 text-sm font-black text-[#f6f3eb]">Page {page} of {pagination.totalPages || 1}</span>
                {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="inline-flex items-center gap-2 rounded-xl border border-[#1d1830]/10 bg-white px-5 py-3 text-sm font-black">Next <ArrowRight className="h-4 w-4" /></Link> : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function FeatureArchiveCard({ post, task, basePath }: { post: SitePost; task: TaskKey; basePath: string }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  const image = getImage(post)
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_68px_rgba(20,14,35,0.08)]">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-7 sm:p-9">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#7f2020]">{getCategory(post, 'Featured')}</p>
          <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.06em] text-[#1d1830] sm:text-5xl">{post.title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#625a6f]">{getSummary(post)}</p>
          <span className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#1d1830] px-5 py-3 text-sm font-black text-[#f6f3eb]">Open post <ArrowRight className="h-4 w-4" /></span>
        </div>
        <div className="min-h-[280px] bg-[#e7e2d7]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      </div>
    </Link>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.8rem] border border-[#1d1830]/10 bg-white shadow-[0_14px_36px_rgba(20,14,35,0.06)] transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#7f2020]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#625a6f]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[1.8rem] border border-[#1d1830]/10 bg-white p-5 shadow-[0_14px_36px_rgba(20,14,35,0.06)] transition hover:-translate-y-1 sm:grid-cols-[110px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.4rem] bg-[#f1e7dc]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#1d1830] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#f6f3eb]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[#1d1830]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#625a6f]">{getSummary(post)}</p>
        {website ? <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[#869b7e]">{website.replace(/^https?:\/\//, '')}</p> : null}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.8rem] border border-[#1d1830]/10 bg-white shadow-[0_14px_36px_rgba(20,14,35,0.06)] transition hover:-translate-y-1">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[#1d1830] p-5 text-[#f6f3eb]">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold opacity-75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#625a6f]">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#7f2020]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.8rem] border border-[#1d1830]/10 bg-white shadow-[0_14px_36px_rgba(20,14,35,0.06)] transition hover:-translate-y-1">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#f1e7dc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><Camera className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[#1d1830]/10 bg-white p-6 shadow-[0_14px_36px_rgba(20,14,35,0.05)] transition hover:-translate-y-1 hover:bg-[#1d1830] hover:text-[#f6f3eb]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="rounded-[1.8rem] border border-[#1d1830]/10 bg-white p-6 shadow-[0_14px_36px_rgba(20,14,35,0.05)] transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[#1d1830] p-5 text-[#f6f3eb]"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[#f1e7dc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#625a6f]">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#7f2020]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="rounded-[1.8rem] border border-[#1d1830]/10 bg-white p-6 text-center shadow-[0_14px_36px_rgba(20,14,35,0.05)] transition hover:-translate-y-1">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#f1e7dc]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#869b7e]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#625a6f]">{getSummary(post)}</p>
    </Link>
  )
}
