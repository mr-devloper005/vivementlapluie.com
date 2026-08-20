import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Camera, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, ' ').trim()

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const raw = asText(content[key])
    const value = raw ? stripHtml(raw) : ''
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => {
  const raw = post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
  const clean = stripHtml(raw)
  return clean || 'Open this post for the full story.'
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = {
    '--detail-bg': '#f6f3eb',
    '--detail-text': '#1d1830',
    '--detail-surface': '#fffdf9',
    '--detail-accent': preset.colors.accent,
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-xl border border-[#1d1830]/10 bg-[#fffdf9]/80 px-4 py-2 text-sm font-black shadow-sm">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function DetailHero({ task, post, summary, badge, showBack = true }: { task: TaskKey; post: SitePost; summary: string; badge: string; showBack?: boolean }) {
  const image = getImages(post)[0]
  return (
    <section className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="editable-gradient-hero overflow-hidden rounded-[2.2rem] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          {showBack ? <BackLink task={task} /> : null}
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#7f2020]">{badge}</p>
              <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.07em] text-[#1d1830] sm:text-6xl lg:text-7xl">{post.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#1d1830]/78">{summary}</p>
            </div>
            <div className="rounded-[2rem] bg-[#1d1830] p-4 text-[#f6f3eb] shadow-[0_24px_80px_rgba(20,14,35,0.18)]">
              {image ? <img src={image} alt="" className="aspect-[16/10] w-full rounded-[1.5rem] object-cover" /> : <div className="flex aspect-[16/10] w-full items-center justify-center rounded-[1.5rem] bg-[#fffdf9]/10"><FileText className="h-14 w-14 opacity-60" /></div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <>
      <DetailHero task="article" post={post} summary={summaryText(post)} badge={categoryOf(post, 'Article')} />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[2rem] border border-[#1d1830]/10 bg-[#fffdf9] p-6 shadow-[0_22px_68px_rgba(20,14,35,0.07)] sm:p-10">
            <BodyContent post={post} />
            <ImageStrip images={getImages(post).slice(1)} label="Additional frames" />
            <EditableComments slug={post.slug} comments={comments} />
          </article>
          <RelatedPanel task="article" post={post} related={related} />
        </div>
      </section>
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <DetailHero task="listing" post={post} summary={summaryText(post)} badge="Business listing" />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[2rem] border border-[#1d1830]/10 bg-[#fffdf9] p-6 shadow-[0_22px_68px_rgba(20,14,35,0.07)] sm:p-10">
            <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Listing gallery" large />
          </article>
          <aside className="space-y-5">
            {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
            <ContactAction website={website} phone={phone} email={email} />
            <RelatedPanel task="listing" post={post} related={related} compact />
          </aside>
        </div>
      </section>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <DetailHero task="classified" post={post} summary={summaryText(post)} badge="Classified notice" />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[1.9rem] bg-[#1d1830] p-7 text-[#f6f3eb] shadow-[0_24px_70px_rgba(20,14,35,0.18)] lg:sticky lg:top-28 lg:self-start">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
            <ContactAction website={website} phone={phone} email={email} invert />
          </aside>
          <article className="rounded-[2rem] border border-[#1d1830]/10 bg-[#fffdf9] p-6 shadow-[0_22px_68px_rgba(20,14,35,0.07)] sm:p-10">
            <ImageStrip images={images} label="Offer images" large />
            <BodyContent post={post} />
            <RelatedPanel task="classified" post={post} related={related} />
          </article>
        </div>
      </section>
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <>
      <DetailHero task="image" post={post} summary='' badge="Image story" />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-[1.9rem] border border-[#1d1830]/10 bg-[#fffdf9] p-7 shadow-[0_18px_54px_rgba(20,14,35,0.06)] lg:sticky lg:top-28 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1d1830] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#f6f3eb]"><Camera className="h-4 w-4" /> Visual gallery</div>
            <BodyContent post={post} compact />
          </aside>
          <div className="columns-1 gap-5 space-y-5 md:columns-2">
            {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
              <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[1.8rem] border border-[#1d1830]/10 bg-[#fffdf9] shadow-[0_14px_36px_rgba(20,14,35,0.05)]">
                <img src={image} alt="" className="w-full object-cover" />
                {index === 0 ? <figcaption className="p-5 text-sm font-bold text-[#625a6f]">Featured visual from this image post.</figcaption> : null}
              </figure>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[1180px]"><RelatedPanel task="image" post={post} related={related} /></div>
      </section>
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <DetailHero task="sbm" post={post} summary={summaryText(post)} badge="Curated resource" />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[2rem] border border-[#1d1830]/10 bg-[#fffdf9] p-7 shadow-[0_22px_68px_rgba(20,14,35,0.07)] sm:p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#1d1830] text-[#f6f3eb]"><Bookmark className="h-9 w-9" /></div>
            {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#1d1830] px-5 py-3 text-sm font-black text-[#f6f3eb]">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
            <BodyContent post={post} />
          </article>
          <RelatedPanel task="sbm" post={post} related={related} />
        </div>
      </section>
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <DetailHero task="pdf" post={post} summary={summaryText(post)} badge="PDF resource" />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[2rem] border border-[#1d1830]/10 bg-[#fffdf9] p-6 shadow-[0_22px_68px_rgba(20,14,35,0.07)] sm:p-10">
            <BodyContent post={post} />
            {fileUrl ? (
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#1d1830]/10 bg-[#f6f3eb]">
                <div className="flex items-center justify-between gap-3 border-b border-[#1d1830]/10 bg-[#fffdf9] p-4">
                  <span className="text-sm font-black">Document preview</span>
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#1d1830] px-4 py-2 text-xs font-black text-[#f6f3eb]">Download <Download className="h-4 w-4" /></Link>
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
              </div>
            ) : null}
          </article>
          <RelatedPanel task="pdf" post={post} related={related} />
        </div>
      </section>
    </>
  )
}

function ProfileDetail({ post, related: _related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <DetailHero task="profile" post={post} summary='' badge="Profile feature" showBack={false} />
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[1.9rem] border border-[#1d1830]/10 bg-[#fffdf9] p-8 text-center shadow-[0_18px_54px_rgba(20,14,35,0.06)] lg:sticky lg:top-28 lg:self-start">
            <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#f1e7dc]">
              {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
            </div>
            <h2 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.07em]">{post.title}</h2>
            {role ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[#869b7e]">{role}</p> : null}
            <ContactAction website={website} email={email} />
          </aside>
          <article className="rounded-[2rem] border border-[#1d1830]/10 bg-[#fffdf9] p-7 shadow-[0_22px_68px_rgba(20,14,35,0.07)] sm:p-10">
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Profile gallery" />
            </article>
        </div>
      </section>
    </>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-[#1d1830]/84`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.4rem] border border-[#1d1830]/10 bg-[#f6f3eb] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#625a6f]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[#1d1830]/85">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#7f2020]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[#1d1830]/10" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-[#1d1830]/10 bg-[#fffdf9] shadow-[0_14px_36px_rgba(20,14,35,0.05)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, invert = false }: { website?: string; phone?: string; email?: string; invert?: boolean }) {
  if (!website && !phone && !email) return null
  return (
    <div className={`mt-5 rounded-[1.8rem] border p-5 shadow-sm ${invert ? 'border-white/10 bg-[#fffdf9]/10 text-[#f6f3eb]' : 'border-[#1d1830]/10 bg-[#fffdf9] text-[#1d1830]'}`}>
      <p className="text-xs font-black uppercase tracking-[0.22em] opacity-55">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black ${invert ? 'bg-[#f6f3eb] text-[#1d1830]' : 'bg-[#1d1830] text-[#f6f3eb]'}`}>Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-xl border border-current/15 px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-xl border border-current/15 px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-[#fffdf9]/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] opacity-60">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post: _post, related, compact: _compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {related.length ? (
        <div className="rounded-[1.8rem] border border-[#1d1830]/10 bg-[#fffdf9] p-5 shadow-[0_14px_36px_rgba(20,14,35,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[#625a6f]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-[1.4rem] border border-[#1d1830]/10 bg-[#fffdf9] p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#f1e7dc]"><FileText className="h-6 w-6 opacity-45" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#625a6f]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[1.8rem] border border-[#1d1830]/10 bg-[#f6f3eb] p-5">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.2rem] border border-[#1d1830]/10 bg-[#fffdf9] p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-[#625a6f]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[#625a6f]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
