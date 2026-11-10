import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SessionProvider } from '@/providers/SessionProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { routes } from './routes'

function ScrollTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0) }, [pathname]); return null }

// Layout = معادل app/layout.jsx در Next.js
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider><SessionProvider>
        <ScrollTop />
        <a className="skip" href="#main">رفتن به محتوا</a>
        <Header />
        <main id="main"><Routes>{routes.map((r) => <Route key={r.path} {...r} />)}</Routes></main>
        <Footer />
      </SessionProvider></ToastProvider>
    </BrowserRouter>
  )
}
