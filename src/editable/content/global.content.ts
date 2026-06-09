import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || '',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: '',
    primaryLinks: [
      { label: 'Images', href: '/image' },
      { label: 'Articles', href: '/article' },
      { label: 'Collections', href: '/sbm' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Request a feature', href: '/contact' },
      secondary: { label: 'Start browsing', href: '/image' },
    },
  },
  footer: {
    tagline: 'Curated visuals, profiles, and editorial discovery',
    description: 'A polished publishing surface for image-led posts, curated reading, useful resources, and discovery pages that still feel human.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Images', href: '/image' },
          { label: 'Articles', href: '/article' },
          { label: 'Listings', href: '/listing' },
          { label: 'Document library', href: '/pdf' },
        ],
      },
      {
        title: 'Studio',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Built for elegant discovery, careful reading, and image-forward browsing.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
