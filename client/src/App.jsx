import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import PrivacyPolicy from './pages/PrivacyPolicy'
import NotFound from './pages/NotFound'
import { SiteDataProvider } from './SiteData'

// The CMS is only downloaded by people who visit /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'))

function PublicSite() {
  return (
    <SiteDataProvider>
      <ScrollToTop />
      <ScrollProgress />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </SiteDataProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<PublicSite />} />
    </Routes>
  )
}
