import { useEffect, useState } from 'react'
import { Link, NavLink, usePathname, useRouter } from '@/lib/navigation'
import { useScrolled } from '@/lib/hooks'
import { useSession } from '@/providers/SessionProvider'
import { SITE } from '@/config/site'
import { faNum, fmtMonthYear, initial } from '@/lib/format'

export const NAV = [
  { href: '/', label: 'خانه', end: true },
  { href: '/artists', label: 'هنرمندان' },
  { href: '/challenges', label: 'چالش‌ها', end: true },
  { href: '/challenges/mine', label: 'چالش‌های من' },
  { href: '/wallet', label: 'کیف توکن' },
  { href: '/terms', label: 'قوانین' },
]

export default function Header() {
  const path = usePathname(); const router = useRouter(); const scrolled = useScrolled(24)
  const { user, balance } = useSession(); const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [path])
  const onHero = path === '/' && !scrolled && !open
  return (
    <header className={`masthead ${onHero ? 'masthead--hero' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="masthead__strip container">
        <span>{SITE.latin} · ماهنامهٔ دیجیتال هنرمندان</span>
        <span>شمارهٔ {faNum('01')} — {fmtMonthYear()}</span>
      </div>
      <div className="masthead__bar container">
        <Link href="/" className="brand" aria-label="آرتمون — خانه">
          <span className="brand__mark"><img src="/logo.png" alt="" width="40" height="40" /></span>
          <span className="brand__word"><b>{SITE.latin}</b><small>{SITE.name}</small></span>
        </Link>
        <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="ناوبری اصلی">
          {NAV.map((n) => <NavLink key={n.href} href={n.href} end={n.end} className={({ isActive }) => `nav__link ${isActive ? 'is-on' : ''}`}>{n.label}</NavLink>)}
        </nav>
        <div className="masthead__actions">
          <Link href="/wallet" className="token-chip" title="کیف توکن"><i aria-hidden>◐</i><b>{faNum(balance)}</b><span>توکن</span></Link>
          {user
            ? <button className="user-chip" onClick={() => router.push('/profile')} aria-label="پروفایل من"><span>{initial(user.stage || user.name)}</span></button>
            : <Link href="/auth" className="btn btn--solid btn--sm"><span>ورود / ثبت‌نام</span></Link>}
          <button className="burger" aria-label="منو" aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /></button>
        </div>
      </div>
    </header>
  )
}
