/**
 * SITE CONTENT SCHEMA
 * -----------------------------------------------------------------------
 * Single source of truth for the website wording people can edit in the
 * CMS. Used by the server (to validate and clean what's saved) and by the
 * CMS (to build the "Site content" editor).
 *
 * Deliberately content-only: wording and photos can change, structure
 * can't. Lists marked `fixed` always keep the items in defaults.js (no
 * adding, removing or reordering), links/icons aren't editable, and every
 * text field must be filled in unless marked `optional`. Company facts
 * (phone, years, registration no. …) are added by the code around the
 * editable wording, so editors never type placeholders.
 *
 * Field types:
 *   text      one line of plain text
 *   textarea  a few lines of plain text
 *   richtext  paragraphs (blank line between) and "- " bullet points
 *   image     an uploaded photo ({ url, thumbUrl }), always optional
 *   list      items made of `fields`; `fixed` lists can't change length
 * -----------------------------------------------------------------------
 */

const sectionLabel = { key: 'label', label: 'Small label above the heading', type: 'text', max: 60 }
const heading = { key: 'heading', label: 'Heading', type: 'text', max: 120 }
const lede = { key: 'lede', label: 'Intro text', type: 'textarea', max: 400 }

export const CONTENT_SCHEMA = [
  {
    key: 'header',
    title: 'Header',
    intro: 'The bar at the top of every page, including the mobile menu.',
    fields: [
      {
        key: 'navLinks',
        label: 'Menu links',
        type: 'list',
        fixed: true,
        itemLabel: 'Link',
        hint: '“Work” is hidden automatically while there are no published projects.',
        fields: [{ key: 'label', label: 'Text', type: 'text', max: 30 }]
      },
      { key: 'ctaLabel', label: 'Button text', type: 'text', max: 40 }
    ]
  },
  {
    key: 'hero',
    title: 'Hero',
    intro: 'The first screen of the homepage.',
    fields: [
      { key: 'image', label: 'Background photo', type: 'image', hint: 'A wide, landscape shot of a finished build works best. If none is uploaded, a stock construction photo is used.' },
      { key: 'eyebrow', label: 'Small text above the headline', type: 'text', max: 60, hint: 'The region and year established from Company details are added after it.' },
      { key: 'establishedPrefix', label: 'Word before the year established', type: 'text', max: 20, hint: 'e.g. EST. — shown as “EST. 2022”.' },
      { key: 'titleBefore', label: 'Headline — start', type: 'text', max: 60 },
      { key: 'titleHighlight', label: 'Headline — highlighted word (blue)', type: 'text', max: 30 },
      { key: 'titleAfter', label: 'Headline — end', type: 'text', max: 60 },
      { key: 'lede', label: 'Intro text', type: 'textarea', max: 500 },
      { key: 'primaryCta', label: 'Main button text', type: 'text', max: 40 },
      { key: 'secondaryCta', label: 'Second button text', type: 'text', max: 40, hint: 'Shown once there are published projects.' },
      { key: 'cardEyebrow', label: 'Quote card — small label', type: 'text', max: 40 },
      { key: 'cardTitle', label: 'Quote card — title', type: 'text', max: 80 },
      {
        key: 'cardPoints',
        label: 'Quote card — bullet points',
        type: 'list',
        fixed: true,
        itemLabel: 'Point',
        fields: [{ key: 'text', label: 'Point', type: 'text', max: 80 }]
      },
      { key: 'cardCta', label: 'Quote card — button text', type: 'text', max: 40 },
      { key: 'statYearsLabel', label: 'Stat label — years', type: 'text', max: 40, hint: 'The numbers come from Company details; a stat with no number is hidden.' },
      { key: 'statProjectsLabel', label: 'Stat label — projects', type: 'text', max: 40 },
      { key: 'statGuaranteeLabel', label: 'Stat label — guarantee', type: 'text', max: 40 },
      { key: 'statGuaranteeUnit', label: 'Stat — word after the guarantee years', type: 'text', max: 20, hint: 'e.g. YR — shown as “10 YR”.' },
      { key: 'statOnTimeLabel', label: 'Stat label — on time', type: 'text', max: 40 }
    ]
  },
  {
    key: 'capabilities',
    title: 'Capabilities',
    intro: 'The “what we build” cards.',
    fields: [
      sectionLabel,
      heading,
      lede,
      {
        key: 'items',
        label: 'Cards',
        type: 'list',
        fixed: true,
        itemLabel: 'Card',
        fields: [
          { key: 'title', label: 'Title', type: 'text', max: 60 },
          { key: 'desc', label: 'Description', type: 'textarea', max: 240 }
        ]
      }
    ]
  },
  {
    key: 'work',
    title: 'Work',
    intro: 'The projects section on the homepage. The projects themselves are edited under Projects.',
    fields: [
      sectionLabel,
      heading,
      lede,
      { key: 'filterAll', label: 'Filter — “all” button', type: 'text', max: 20 },
      { key: 'sortLabel', label: 'Sort — label', type: 'text', max: 20 },
      { key: 'sortDefault', label: 'Sort — default order', type: 'text', max: 40 },
      { key: 'sortAsc', label: 'Sort — budget low to high', type: 'text', max: 40 },
      { key: 'sortDesc', label: 'Sort — budget high to low', type: 'text', max: 40 },
      { key: 'viewProject', label: 'Text shown when hovering a project', type: 'text', max: 30 },
      { key: 'empty', label: 'Message when a filter has no projects', type: 'text', max: 120 }
    ]
  },
  {
    key: 'coverage',
    title: 'Map',
    intro: 'The “where we build” map. Shown once a published project has a town.',
    fields: [
      sectionLabel,
      { key: 'headingPrefix', label: 'Heading', type: 'text', max: 80, hint: 'The areas from Company details are added after it, e.g. “Recent work across Berkshire & Surrey”.' },
      { key: 'headingFallback', label: 'Heading when no areas are set', type: 'text', max: 120 },
      { key: 'caption', label: 'Caption under the map', type: 'text', max: 160 }
    ]
  },
  {
    key: 'divider',
    title: 'Drawing band',
    intro: 'The thin blueprint strip between the map and the track record.',
    fields: [
      { key: 'left', label: 'Left text', type: 'text', max: 40 },
      { key: 'right', label: 'Right text', type: 'text', max: 40 }
    ]
  },
  {
    key: 'trackRecord',
    title: 'Track record',
    intro: 'The dark band of big numbers. The numbers come from Company details; anything without one is hidden.',
    fields: [
      sectionLabel,
      heading,
      { key: 'yearsUnit', label: 'Years — word after the number', type: 'text', max: 20, hint: 'e.g. YRS — shown as “4 YRS”.' },
      { key: 'yearsLabel', label: 'Years — label', type: 'text', max: 40 },
      { key: 'projectsLabel', label: 'Projects — label', type: 'text', max: 40 },
      { key: 'guaranteeUnit', label: 'Guarantee — words after the number', type: 'text', max: 30, hint: 'e.g. YR GUARANTEE — shown as “10 YR GUARANTEE”.' },
      { key: 'guaranteeLabel', label: 'Guarantee — label', type: 'text', max: 40 },
      { key: 'insuredValue', label: 'Insurance — big text', type: 'text', max: 40, hint: 'Shown when “fully insured” is ticked in Company details.' },
      { key: 'insuredLabel', label: 'Insurance — label', type: 'text', max: 40 }
    ]
  },
  {
    key: 'process',
    title: 'Process',
    intro: 'The numbered “how it works” steps.',
    fields: [
      sectionLabel,
      heading,
      lede,
      {
        key: 'steps',
        label: 'Steps',
        type: 'list',
        fixed: true,
        itemLabel: 'Step',
        fields: [
          { key: 'title', label: 'Title', type: 'text', max: 60 },
          { key: 'desc', label: 'Description', type: 'textarea', max: 300 }
        ]
      }
    ]
  },
  {
    key: 'testimonials',
    title: 'Reviews',
    intro: 'Customer reviews. Make sure each customer is happy to be quoted and named. With no reviews, the section is hidden.',
    fields: [
      sectionLabel,
      {
        key: 'items',
        label: 'Reviews',
        type: 'list',
        min: 0,
        max: 6,
        itemLabel: 'Review',
        fields: [
          { key: 'quote', label: 'Review text', type: 'textarea', max: 600 },
          { key: 'name', label: 'Customer name as shown', type: 'text', max: 120, optional: true, hint: 'e.g. Sarah & Michael Thompson' },
          { key: 'town', label: 'Customer town', type: 'text', max: 120, optional: true, hint: 'e.g. Wokingham, Berkshire' }
        ]
      }
    ]
  },
  {
    key: 'quote',
    title: 'Get a quote',
    intro: 'The enquiry section at the bottom of the homepage and project pages.',
    fields: [
      sectionLabel,
      heading,
      { key: 'lede', label: 'Intro text', type: 'textarea', max: 500 },
      { key: 'callPrompt', label: 'Text before the phone number', type: 'text', max: 60, hint: 'The phone number from Company details is added after it.' },
      { key: 'nameLabel', label: 'Form — name label', type: 'text', max: 60 },
      { key: 'emailLabel', label: 'Form — email label', type: 'text', max: 60 },
      { key: 'phoneLabel', label: 'Form — phone label', type: 'text', max: 60 },
      { key: 'projectTypeLabel', label: 'Form — project type label', type: 'text', max: 60 },
      { key: 'projectTypePlaceholder', label: 'Form — project type placeholder', type: 'text', max: 60 },
      {
        key: 'projectTypes',
        label: 'Form — project type choices',
        type: 'list',
        fixed: true,
        itemLabel: 'Choice',
        fields: [{ key: 'text', label: 'Choice', type: 'text', max: 60 }]
      },
      { key: 'postcodeLabel', label: 'Form — postcode label', type: 'text', max: 60 },
      { key: 'messageLabel', label: 'Form — message label', type: 'text', max: 80 },
      { key: 'consentText', label: 'Form — consent text', type: 'text', max: 120, hint: 'The privacy policy link below is added after this.' },
      { key: 'consentLinkText', label: 'Form — privacy policy link text', type: 'text', max: 60 },
      { key: 'submitLabel', label: 'Form — send button', type: 'text', max: 40 },
      { key: 'sendingLabel', label: 'Form — button while sending', type: 'text', max: 40 },
      { key: 'successMessage', label: 'Message after sending', type: 'text', max: 200 },
      { key: 'errorMessage', label: 'Message when details need fixing', type: 'text', max: 200 },
      { key: 'networkError', label: 'Message when the site can’t be reached', type: 'text', max: 200 },
      { key: 'errName', label: 'Error — name', type: 'text', max: 120 },
      { key: 'errEmail', label: 'Error — email', type: 'text', max: 120 },
      { key: 'errPhone', label: 'Error — phone', type: 'text', max: 120 },
      { key: 'errProjectType', label: 'Error — project type', type: 'text', max: 120 },
      { key: 'errPostcode', label: 'Error — postcode', type: 'text', max: 120 },
      { key: 'errConsent', label: 'Error — consent', type: 'text', max: 120 }
    ]
  },
  {
    key: 'footer',
    title: 'Footer',
    intro: 'The bottom of every page. Contact details come from Company details.',
    fields: [
      { key: 'areasHeading', label: 'Areas heading', type: 'text', max: 40, hint: 'Shown when Areas covered is filled in.' },
      { key: 'assuranceHeading', label: 'Assurance heading', type: 'text', max: 40 },
      { key: 'insuredLine', label: 'Assurance — insurance line', type: 'text', max: 160, hint: 'Shown when “fully insured” is ticked.' },
      { key: 'guaranteeText', label: 'Assurance — guarantee line', type: 'text', max: 160, hint: 'The years are added in front, e.g. “10-year structural guarantee…”.' },
      { key: 'registrationPrefix', label: 'Assurance — company number line', type: 'text', max: 160, hint: 'The number is added after it.' },
      { key: 'copyrightText', label: 'Copyright line', type: 'text', max: 160, hint: '“©” and the current year are added in front.' },
      { key: 'privacyLinkText', label: 'Privacy policy link text', type: 'text', max: 40 }
    ]
  },
  {
    key: 'project',
    title: 'Project pages',
    intro: 'Wording around each project page. Project details themselves are edited under Projects.',
    fields: [
      { key: 'back', label: 'Back link', type: 'text', max: 40 },
      { key: 'factsHeading', label: 'Facts box heading', type: 'text', max: 40 },
      { key: 'factType', label: 'Fact — project type', type: 'text', max: 40 },
      { key: 'factLocation', label: 'Fact — location', type: 'text', max: 40 },
      { key: 'factDuration', label: 'Fact — duration', type: 'text', max: 40 },
      { key: 'factCost', label: 'Fact — cost band', type: 'text', max: 40 },
      { key: 'cta', label: 'Facts box button', type: 'text', max: 40 },
      { key: 'briefHeading', label: 'Heading — brief', type: 'text', max: 40 },
      { key: 'approachHeading', label: 'Heading — approach', type: 'text', max: 40 },
      { key: 'resultHeading', label: 'Heading — result', type: 'text', max: 40 },
      { key: 'timelineHeading', label: 'Heading — timeline', type: 'text', max: 40 },
      { key: 'beforeAfterLabel', label: 'Before & after — small label', type: 'text', max: 60 },
      { key: 'beforeAfterHeading', label: 'Before & after — heading', type: 'text', max: 80 },
      { key: 'beforeTag', label: 'Before & after — “before” tag', type: 'text', max: 20 },
      { key: 'afterTag', label: 'Before & after — “after” tag', type: 'text', max: 20 },
      { key: 'moreLabel', label: 'More projects — small label', type: 'text', max: 60 },
      { key: 'moreHeading', label: 'More projects — heading', type: 'text', max: 80 }
    ]
  },
  {
    key: 'privacy',
    title: 'Privacy policy',
    intro: 'The /privacy-policy page. Have it checked if you change what data you collect or who you share it with.',
    fields: [
      { key: 'eyebrow', label: 'Small label', type: 'text', max: 40 },
      { key: 'title', label: 'Title', type: 'text', max: 80 },
      { key: 'intro', label: 'Intro', type: 'textarea', max: 500 },
      { key: 'lastUpdated', label: 'Last updated line', type: 'text', max: 80, hint: 'Shown after the intro. Update it whenever the policy changes.' },
      { key: 'whoHeading', label: 'First section — heading', type: 'text', max: 80 },
      { key: 'companyName', label: 'First section — company name', type: 'text', max: 80, hint: 'The registration number and address from Company details follow it.' },
      { key: 'whoText', label: 'First section — text after the company details', type: 'textarea', max: 300 },
      { key: 'contactPrefix', label: 'First section — text before the email', type: 'text', max: 80, hint: 'The enquiries email is added after it.' },
      {
        key: 'sections',
        label: 'Middle sections',
        type: 'list',
        fixed: true,
        itemLabel: 'Section',
        hint: 'Leave a blank line between paragraphs. Start a line with “- ” for a bullet point.',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text', max: 80 },
          { key: 'body', label: 'Text', type: 'richtext', max: 3000 }
        ]
      },
      { key: 'contactHeading', label: 'Last section — heading', type: 'text', max: 80 },
      { key: 'dataRequestPrefix', label: 'Last section — text before the privacy email', type: 'text', max: 80 },
      { key: 'icoPrefix', label: 'Last section — text before the ICO number', type: 'text', max: 80, hint: 'Only shown when an ICO number is set in Company details.' },
      { key: 'complaintText', label: 'Last section — closing text', type: 'textarea', max: 300 }
    ]
  },
  {
    key: 'notFound',
    title: 'Page not found',
    intro: 'Shown when someone opens a link that doesn’t exist.',
    fields: [
      { key: 'label', label: 'Small label', type: 'text', max: 40 },
      { key: 'heading', label: 'Heading', type: 'text', max: 80 },
      { key: 'text', label: 'Text', type: 'textarea', max: 300 },
      { key: 'button', label: 'Button text', type: 'text', max: 40 }
    ]
  },
  {
    key: 'seo',
    title: 'Search & sharing',
    intro: 'How the site appears in Google results and when a link is shared on WhatsApp, Facebook or LinkedIn.',
    fields: [
      { key: 'title', label: 'Page title (browser tab & Google)', type: 'text', max: 70, hint: 'Ideally under 60 characters.' },
      { key: 'description', label: 'Description (Google)', type: 'textarea', max: 200, hint: 'Ideally 120–160 characters.' },
      { key: 'shareTitle', label: 'Share title', type: 'text', max: 90 },
      { key: 'shareDescription', label: 'Share description', type: 'textarea', max: 200 },
      { key: 'shareImage', label: 'Share image', type: 'image', hint: 'Landscape, ideally 1200×630. If none, the homepage photo is used.' },
      { key: 'projectTitleSuffix', label: 'Added after project names in the tab title', type: 'text', max: 60, hint: 'e.g. — RNK2 Properties Ltd' }
    ]
  }
]
