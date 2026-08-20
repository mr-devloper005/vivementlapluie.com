'use client'

import { Bookmark, Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
      { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
      { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place in the library.' },
    { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
    { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or profile-connected boards?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="bg-[#f6f3eb] text-[#1d1830]">
        <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="editable-gradient-hero rounded-[2.2rem] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#7f2020]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{pagesContent.contact.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#1d1830]/74">{pagesContent.contact.description}</p>
          </div>
        </section>
        <section className="mx-auto mt-4 grid max-w-[1180px] gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:px-8">
          <div className="space-y-4">
            {lanes.map((lane) => (
              <div key={lane.title} className="rounded-[1.8rem] border border-[#1d1830]/10 bg-[#fffdf9] p-5 shadow-[0_14px_36px_rgba(20,14,35,0.05)]">
                <lane.icon className="h-5 w-5 text-[#7f2020]" />
                <h2 className="mt-3 text-xl font-black">{lane.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#625a6f]">{lane.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-[#1d1830]/10 bg-[#fffdf9] p-7 shadow-[0_20px_60px_rgba(20,14,35,0.08)]">
            <h2 className="text-2xl font-black">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
