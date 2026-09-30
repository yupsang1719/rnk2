import { Routes, Route } from 'react-router-dom'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
