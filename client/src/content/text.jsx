/**
 * Turning CMS text into what the page shows. Nothing here ever renders HTML
 * from the CMS: text is split into React elements, so it can't break the page.
 */

// Years since the company was established, or '' if unknown.
export function yearsSince(year) {
  const n = parseInt(year, 10)
  if (!n || n < 1900) return ''
  const years = new Date().getFullYear() - n
  return years > 0 ? String(years) : ''
}

const EMAIL_RE = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/

// Email addresses become clickable; everything else is plain text.
function withEmailLinks(text) {
  return text.split(EMAIL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      part
    )
  )
}

const BULLET_RE = /^\s*[-•]\s+/

/**
 * Plain text where a blank line starts a new paragraph and lines starting
 * with "- " are bullet points.
 */
export function RichText({ text, paragraphClass, listClass }) {
  const blocks = String(text || '')
    .split(/\n\s*\n/)
    .map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((lines) => lines.length)

  const out = []
  blocks.forEach((lines, b) => {
    // A block can mix text lines and bullet lines; group consecutive runs.
    let run = []
    let runIsList = null
    const flush = (k) => {
      if (!run.length) return
      out.push(
        runIsList ? (
          <ul className={listClass} key={k}>
            {run.map((l, i) => (
              <li key={i}>{withEmailLinks(l.replace(BULLET_RE, ''))}</li>
            ))}
          </ul>
        ) : (
          <p className={paragraphClass} key={k}>
            {run.flatMap((l, i) => [...(i ? [<br key={`br${i}`} />] : []), ...withEmailLinks(l)])}
          </p>
        )
      )
      run = []
    }
    lines.forEach((line, i) => {
      const isItem = BULLET_RE.test(line)
      if (runIsList !== null && isItem !== runIsList) flush(`b${b}-${i}`)
      runIsList = isItem
      run.push(line)
    })
    flush(`b${b}-end`)
  })
  return out
}
