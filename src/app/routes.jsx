// جدول مسیرها. نگاشت به Next.js App Router (فاز بعد):
//   /                 → app/page.jsx
//   /artists          → app/artists/page.jsx
//   /artists/:id      → app/artists/[id]/page.jsx
//   /auth             → app/auth/page.jsx
//   /profile          → app/profile/page.jsx
//   /wallet           → app/wallet/page.jsx
//   /challenges       → app/challenges/page.jsx
//   /challenges/mine  → app/challenges/mine/page.jsx
//   /challenges/:id   → app/challenges/[id]/page.jsx
//   /terms            → app/terms/page.jsx
import Home from './pages/Home'
import Artists from './pages/Artists'
import ArtistProfile from './pages/ArtistProfile'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Wallet from './pages/Wallet'
import Challenges from './pages/Challenges'
import MyChallenges from './pages/MyChallenges'
import ChallengeDetail from './pages/ChallengeDetail'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/artists', element: <Artists /> },
  { path: '/artists/:id', element: <ArtistProfile /> },
  { path: '/auth', element: <Auth /> },
  { path: '/profile', element: <Profile /> },
  { path: '/wallet', element: <Wallet /> },
  { path: '/challenges', element: <Challenges /> },
  { path: '/challenges/mine', element: <MyChallenges /> },
  { path: '/challenges/:id', element: <ChallengeDetail /> },
  { path: '/terms', element: <Terms /> },
  { path: '*', element: <NotFound /> },
]
