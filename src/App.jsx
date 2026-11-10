import { useEffect, useState } from 'react'
import { StoreProvider } from './store.jsx'
import { Navbar, Footer } from './ui.jsx'
import { Home, Artists, ArtistProfile, Signup, Wallet, Terms, Profile } from './pages.jsx'
import { Challenges, MyChallenges, ChallengeDetail } from './challenges.jsx'
const useRoute = () => {
  const [h, setH] = useState(location.hash.slice(1) || '/')
  useEffect(() => { const f = () => { setH(location.hash.slice(1) || '/'); window.scrollTo(0, 0) }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  return h
}
export default function App() {
  const r = useRoute()
  let page = <Home />
  if (r === '/artists') page = <Artists />
  else if (r.startsWith('/artist/')) page = <ArtistProfile id={+r.split('/')[2]} />
  else if (r === '/signup') page = <Signup />
  else if (r === '/wallet') page = <Wallet />
  else if (r === '/challenges') page = <Challenges />
  else if (r === '/challenges/mine') page = <MyChallenges />
  else if (r.startsWith('/challenges/')) page = <ChallengeDetail id={r.split('/')[2]} />
  else if (r === '/terms') page = <Terms />
  else if (r === '/profile') page = <Profile />
  return (
    <StoreProvider>
      <div className="blobs" aria-hidden><i /><i /><i /></div>
      <Navbar route={r} />
      <main>{page}</main>
      <Footer />
    </StoreProvider>
  )
}
