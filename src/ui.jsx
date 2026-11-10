import { useState } from 'react'
import { useStore, go } from './store.jsx'
import { CONTACT_COST } from './data.js'
const P = {
  coin:'M14.6 9.3c-.6-.8-1.6-1.3-2.6-1.3-1.7 0-2.8.9-2.8 2.1 0 3 5.6 1.4 5.6 4.5 0 1.3-1.2 2.2-2.8 2.2-1.1 0-2.1-.5-2.8-1.3M12 6v2M12 16v2',
  brush:'M18.4 2.6a2 2 0 0 1 3 3L11 16l-4 1 1-4zM6.5 18C6.5 20 5 21 2.5 21c1.5-.7 1.2-2.8 2-3.6',
  trophy:'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3',
  user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  users:'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .6 3.5 2.2 3.5 5.2',
  lock:'M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V8a4 4 0 0 1 8 0v3',
  heart:'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
  star:'M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.4 6.4 20.4l1.1-6.3L3 9.7l6.2-.9z',
  search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  phone:'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  mail:'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 7l9 6 9-6',
  menu:'M4 7h16M4 12h16M4 17h16',
  play:'M8 5v14l11-7z', pause:'M8 5v14M16 5v14',
  vol:'M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7', mute:'M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6',
  arrow:'M19 12H5M11 6l-6 6 6 6', plus:'M12 5v14M5 12h14', check:'M5 12l5 5 9-10', send:'M7 17L17 7M8 7h9v9',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', music:'M9 18V6l11-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z',
  quote:'M7 8H5a2 2 0 0 0-2 2v4h5v-4H5M17 8h-2a2 2 0 0 0-2 2v4h5v-4h-3', image:'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 17l5-5 4 4 3-3 6 6M9 9.5h.01',
  leaf:'M5 19c0-8 5-13 15-14 0 10-5 15-13 15M5 19c2-4 5-7 9-9',
}
export const Icon = ({ n, fill, className = '' }) => <svg className={'ic' + (fill ? ' fill' : '') + ' ' + className} viewBox="0 0 24 24" aria-hidden="true"><path d={P[n]} /></svg>
const links = [['/', 'خانه'], ['/artists', 'هنرمندان'], ['/challenges', 'چالش‌ها'], ['/challenges/mine', 'چالش‌های من'], ['/wallet', 'کیف توکن'], ['/terms', 'قوانین']]
export function Navbar({ route }) {
  const { user, tokens } = useStore(); const [open, setOpen] = useState(false)
  return (
    <header className="nav clay">
      <a className="brand" href="#/"><img src="/logo.png" alt="آرتمون" /><b>Artemoon</b></a>
      <nav className={open ? 'open' : ''}>
        {links.map(([p, t]) => <a key={p} href={'#' + p} className={route === p ? 'on' : ''} onClick={() => setOpen(false)}>{t}</a>)}
      </nav>
      <div className="nav-actions">
        <a href="#/wallet" className="chip" title="کیف توکن"><Icon n="coin" /> {tokens}</a>
        {user ? <a href="#/profile" className="avatar sm">{user.name?.[0] || 'ه'}</a> : <a href="#/signup" className="btn sm">ثبت‌نام / ورود</a>}
        <button className="burger" aria-label="منو" onClick={() => setOpen(!open)}><Icon n="menu" /></button>
      </div>
    </header>
  )
}
export function Footer() {
  return (
    <footer className="footer clay">
      <div><img src="/logo.png" alt="" /><p>آرتمون؛ شبکه حرفه‌ای هنرمندان برای دیده‌شدن، همکاری و ارتباط.</p></div>
      <div><h4>دسترسی سریع</h4>{links.map(([p, t]) => <a key={p} href={'#' + p}>{t}</a>)}</div>
      <div><h4>هنرمندان</h4><a href="#/signup">ساخت پروفایل هنری</a><a href="#/artists">لیست هنرمندان</a></div>
      <small>© ۱۴۰۵ Artemoon — همه حقوق محفوظ است.</small>
    </footer>
  )
}
export function Avatar({ a, size = '' }) {
  return <div className={'avatar ' + size} style={{ background: `linear-gradient(135deg,hsl(${a.hue} 35% 78%),hsl(${(a.hue + 60) % 360} 30% 62%))` }}>{a.name[0]}</div>
}
export function ArtistCard({ a }) {
  return (
    <article className="card clay lift" onClick={() => go('/artist/' + a.id)}>
      {a.promoted && <span className="badge"><Icon n="star" fill /> برجسته</span>}
      <Avatar a={a} size="lg" />
      <h3>{a.name}</h3><p className="muted">{a.cat} · {a.city}</p>
      <div className="tags"><span>{a.level}</span><span>★ {a.rating}</span></div>
      <button className="btn ghost sm">مشاهده پروفایل</button>
    </article>
  )
}
export function ContactBox({ a }) {
  const { user, tokens, unlocked, unlock } = useStore(); const [confirm, setConfirm] = useState(false)
  if (unlocked.includes(a.id)) return <div className="contact clay-in"><h4>اطلاعات تماس</h4><p><Icon n="phone" /> {a.phone}</p><p><Icon n="mail" /> {a.email}</p></div>
  const click = () => { if (!user) return go('/signup'); if (tokens < CONTACT_COST) return go('/wallet'); setConfirm(true) }
  return (
    <div className="contact clay-in">
      <h4>اطلاعات تماس</h4>
      <p className="blur"><Icon n="phone" /> ۰۹۱۲ ••• ••••<br /><Icon n="mail" /> ••••@••••.ir</p>
      <button className="btn" onClick={click}>راه‌های ارتباطی ({CONTACT_COST} توکن)</button>
      {!user && <small className="muted">برای مشاهده باید ثبت‌نام کنید و توکن بخرید.</small>}
      {confirm && <div className="modal" onClick={() => setConfirm(false)}><div className="clay pad" onClick={e => e.stopPropagation()}>
        <h3>تأیید نمایش اطلاعات تماس</h3>
        <p>{CONTACT_COST} توکن از موجودی شما ({tokens}) کسر می‌شود.</p>
        <div className="row"><button className="btn" onClick={() => { unlock(a.id, CONTACT_COST); setConfirm(false) }}>تأیید و پرداخت</button><button className="btn ghost" onClick={() => setConfirm(false)}>انصراف</button></div>
      </div></div>}
    </div>
  )
}
