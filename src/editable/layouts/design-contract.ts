import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f6f3eb',
  '--slot4-page-text': '#1f1730',
  '--slot4-panel-bg': '#f1e7dc',
  '--slot4-surface-bg': '#fffdf9',
  '--slot4-muted-text': '#625a6f',
  '--slot4-soft-muted-text': '#7d748a',
  '--slot4-accent': '#7f2020',
  '--slot4-accent-fill': '#7f2020',
  '--slot4-accent-soft': '#c9caac',
  '--slot4-dark-bg': '#1d1830',
  '--slot4-dark-text': '#f6f3eb',
  '--slot4-media-bg': '#e7e2d7',
  '--slot4-cream': '#f6f3eb',
  '--slot4-warm': '#f1e7dc',
  '--slot4-lavender': '#ece6dd',
  '--slot4-gray': '#eeebe4',
  '--slot4-olive': '#869b7e',
  '--slot4-body-gradient': 'radial-gradient(circle at 18% 18%, rgba(127,32,32,0.16), transparent 28%), radial-gradient(circle at 86% 20%, rgba(134,155,126,0.18), transparent 32%), linear-gradient(180deg, #f8f5ee 0%, #f6f3eb 38%, #efe8de 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  oliveText: 'text-[var(--slot4-olive)]',
  oliveBg: 'bg-[var(--slot4-olive)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[#221a33]/10',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_18px_48px_rgba(20,14,35,0.08)]',
  shadowStrong: 'shadow-[0_30px_80px_rgba(20,14,35,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.62))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-18 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[220px] shrink-0 snap-start sm:w-[240px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.22em]',
    heroTitle: 'text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-[5.7rem]',
    sectionTitle: 'text-4xl font-black leading-[0.92] tracking-[-0.06em] sm:text-5xl lg:text-6xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-xl ${editablePalette.darkBg} px-7 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5`,
    secondary: `inline-flex items-center justify-center rounded-xl border ${editablePalette.border} ${editablePalette.surfaceBg} px-7 py-3.5 text-sm font-black ${editablePalette.surfaceText} transition hover:bg-black/[0.03]`,
    accent: `inline-flex items-center justify-center rounded-xl ${editablePalette.accentBg} px-7 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.4rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[2/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(0,0,0,0.14)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing, like the MysteryCoder reference layout.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
