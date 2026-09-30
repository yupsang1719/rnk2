const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

export function IconExtension(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21V10.5L10 5l6 5.5V13" />
      <path d="M13 21v-6h7v6" />
      <path d="M4 21h16" />
    </svg>
  )
}

export function IconLoft(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 13 12 5l9 8" />
      <path d="M6 13v8h12v-8" />
      <rect x="10" y="8.5" width="4" height="4" rx="0.5" />
    </svg>
  )
}

export function IconNewBuild(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21V11L12 4l8 7v10H4Z" />
      <path d="M17 2.5v4M15 4.5h4" />
    </svg>
  )
}

export function IconDrawings(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="M8.5 15.5 15 9" />
    </svg>
  )
}

export function IconStructural(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4h14M5 20h14" />
      <path d="M9 4v16M15 4v16" />
      <path d="M9 4H5M15 4h4M9 20H5M15 20h4" />
    </svg>
  )
}

export function IconManagement(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="4" width="14" height="17" rx="1" />
      <path d="M9 4V3h6v1" />
      <path d="M8.5 13l2.5 2.5L16 10" />
    </svg>
  )
}

export function IconArrow(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconPlus(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  )
}

export function IconSetSquare(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V4h16" />
      <path d="M4 20 16 8" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function IconChevron(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function IconPin(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-7.6 7-12a7 7 0 0 0-14 0c0 4.4 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}
