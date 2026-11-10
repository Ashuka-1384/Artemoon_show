import { Link } from '@/lib/navigation'
import { SITE } from '@/config/site'
import { NAV } from './Header'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/logo.png" alt="" width="72" height="72" />
          <p className="display-sm">{SITE.slogan}.</p>
          <p className="muted">آرتمون؛ شبکهٔ حرفه‌ای هنرمندان برای دیده‌شدن، همکاری، ارتباط و رقابت.</p>
        </div>
        <nav aria-label="پیوندهای پایین صفحه"><h4 className="eyebrow">دسترسی سریع</h4>{NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}</nav>
        <nav><h4 className="eyebrow">هنرمندان</h4><Link href="/auth">ساخت پروفایل هنری</Link><Link href="/artists">فهرست هنرمندان</Link><Link href="/challenges">آرنای چالش‌ها</Link></nav>
        <div><h4 className="eyebrow">توکن</h4><p className="muted">توکن‌ها اعتبار مجازی پلتفرم‌اند و ارزش نقدی مستقل ندارند.</p></div>
      </div>
      <div className="container footer__base"><span>© ۱۴۰۵ {SITE.latin} — همهٔ حقوق محفوظ است.</span><span>Art → Industry</span></div>
    </footer>
  )
}
