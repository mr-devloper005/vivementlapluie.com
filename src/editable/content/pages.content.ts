import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Luxury editorial visuals, profiles, and discovery',
      description: 'Explore image-led stories, thoughtful profiles, and curated collections through a premium editorial interface.',
      openGraphTitle: 'Luxury editorial visuals, profiles, and discovery',
      openGraphDescription: 'A polished image-first destination for visual posts, long reads, and curated discovery.',
      keywords: ['image editorial', 'visual discovery', 'luxury magazine', 'profile stories'],
    },
    hero: {
      badge: '',
      title: ['See the collection.', 'Read the story.'],
      description: 'Browse elegant image-led publishing and polished editorial cards arranged for quick discovery and deep reading.',
      primaryCta: { label: 'Explore the gallery', href: '/image' },
      secondaryCta: { label: 'Browse articles', href: '/article' },
      searchPlaceholder: 'Search visuals, profiles, guides, and collections',
      focusLabel: 'Featured lane',
      featureCardBadge: 'homepage spotlight',
      featureCardTitle: 'Every new post becomes part of a cleaner visual narrative.',
      featureCardDescription: 'Fresh stories, portraits, resources, and image collections move through a premium homepage without changing how the data works.',
    },
    intro: {
      badge: 'About the publication',
      title: 'Built for visual curiosity, careful reading, and graceful exploration.',
      paragraphs: [
        'This site brings together image-led browsing, editorial reading, and structured discovery so visitors can move naturally between different kinds of posts.',
        'Instead of forcing every section into the same template, the experience gives each content type its own rhythm while keeping the overall navigation calm and consistent.',
        'Whether someone begins with a visual post, a profile, a long read, or a resource, they can continue exploring without losing context.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Image-first homepage with strong editorial hierarchy.',
        'Distinct card styles for galleries, profiles, guides, and links.',
        'A calmer browsing rhythm with clear spacing and contrast.',
        'Lightweight interactions that keep discovery quick and polished.',
      ],
      primaryLink: { label: 'Browse articles', href: '/article' },
      secondaryLink: { label: 'See visuals', href: '/image' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Build your next reading trail from images, essays, and standout profiles.',
      description: 'Move between galleries, stories, documents, listings, and curated collections through one connected interface.',
      primaryCta: { label: 'Browse Articles', href: '/article' },
      secondaryCta: { label: 'Contact Us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Editorial direction',
    title: 'A richer way to discover visuals, people, and thoughtful reading.',
    description: `${slot4BrandConfig.siteName} is designed to make visual discovery, profile browsing, and editorial reading feel polished from the first glance.`,
    paragraphs: [
      'The interface balances bold presentation with readable structure so every section can feel distinct without becoming hard to use.',
      'Visual posts lead with atmosphere, profiles emphasize identity, and articles keep enough space to breathe, all while staying connected through the same navigation system.',
    ],
    values: [
      {
        title: 'Image-first presentation',
        description: 'We prioritize shape, contrast, and pacing so visuals feel immersive without overwhelming the page.',
      },
      {
        title: 'Connected discovery',
        description: 'Articles, visual posts, listings, resources, and profiles stay close enough to invite curiosity across the entire site.',
      },
      {
        title: 'Clear and trustworthy',
        description: 'The experience stays clean, readable, and direct so visitors can move through public content with confidence.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Share a project, ask a question, or request a feature.',
    description: 'Use this page to ask about submissions, partnerships, publishing support, or custom collection ideas. The form stays simple, but the presentation should feel premium.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find stories, listings, visuals, and resources faster.',
      description: 'Use keywords, categories, and content types to move quickly through every active section of the site.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to open the publishing workspace.',
      description: 'Use your account to access the submission surface and prepare content for any active section of the site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create polished posts for every active section.',
      description: 'Choose a content type, add the essentials, and prepare a clean post with images, links, summary text, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Return to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to unlock the publishing workspace, save your details, and submit new content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
