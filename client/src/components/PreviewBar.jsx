import { exitPreview, useSiteData } from '../SiteData'

// Shown only in a tab opened with "Preview" from the CMS.
export default function PreviewBar() {
  const { preview, previewDenied, status } = useSiteData()
  if (!preview || status === 'loading') return null

  return (
    <div className={`preview-bar${previewDenied ? ' preview-bar--warn' : ''}`} role="status">
      <span>
        {previewDenied
          ? 'Sign in to the website admin to preview unpublished changes. Showing the live site.'
          : 'Preview — these changes are not published yet. Visitors still see the live site.'}
      </span>
      <button type="button" onClick={exitPreview}>
        Exit preview
      </button>
    </div>
  )
}
