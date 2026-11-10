import { artists, challenges } from '@/services'
import { useAsync, useNow, useReveal } from '@/lib/hooks'
import { CATEGORIES } from '@/lib/constants'
import { faNum } from '@/lib/format'
import { Link } from '@/lib/navigation'
import { Button, Eyebrow, SectionHead } from '@/components/ui'
import HeroBackdrop from '@/components/home/HeroBackdrop'
import Marquee from '@/components/home/Marquee'
import ArtistCard from '@/components/artists/ArtistCard'
import ChallengeCard from '@/components/challenges/ChallengeCard'

const Reveal = ({ children, className = '' }) => { const r = useReveal(); return <div ref={r} className={`reveal ${className}`}>{children}</div> }

const STEPS = [
  ['۰۱', 'ثبت‌نام و نمونه‌کار', 'فرم ثبت‌نام را پر کن و دست‌کم یک نمونه‌کار بارگذاری کن. پروفایل حرفه‌ای تو بلافاصله ساخته می‌شود.'],
  ['۰۲', 'دیده‌شدن در شبکه', 'نام و آثار تو در فهرست هنرمندان می‌آید؛ اما موبایل، ایمیل و تلگرامت پنهان می‌ماند.'],
  ['۰۳', 'ارتباط با توکن', 'هر کاربر ثبت‌نام‌شده با خرج‌کردن توکن، راه‌های ارتباطی هنرمند موردنظرش را باز می‌کند.'],
]
const ARENA = [['توکن می‌گذاری', 'هنرمند هم‌حوزه را دعوت کن، مدتِ ۱ تا ۴ هفته و مبلغ توکن را تعیین کن.'], ['رقیب می‌پذیرد', 'او هم همان مقدار توکن می‌گذارد و چالش آغاز می‌شود.'], ['اثر بارگذاری می‌شود', 'هر دو یک اثر مرتبط با حوزه‌شان در پنل چالش ثبت می‌کنند.'], ['جامعه رأی می‌دهد', 'کاربران ثبت‌نام‌شده آثار را می‌بینند و به یکی رأی می‌دهند.'], ['برنده همه‌چیز را می‌برد', 'در پایان مدت، پررأی‌ترین اثر کل توکن‌های میانه را برمی‌دارد.']]

export default function Home() {
  const now = useNow(); const feat = useAsync(() => artists.list().then((l) => l.filter((a) => a.promoted).slice(0, 5)))
  const live = useAsync(() => challenges.list({ status: 'active' }).then((l) => l.slice(0, 2))); const st = useAsync(() => challenges.stats())
  const s = st.data
  return (
    <>
      <section className="hero">
        <HeroBackdrop />
        <div className="container hero__grid">
          <div className="hero__main">
            <Eyebrow light>Artemoon — شبکهٔ حرفه‌ای هنرمندان</Eyebrow>
            <h1 className="hero__title"><span>تبدیل</span> <em>هنر</em><br /><span>به صنعت</span></h1>
            <p className="hero__lead">آرتمون جایی است که هنرمند دیده می‌شود: پروفایل حرفه‌ای بساز، نمونه‌کارت را به نمایش بگذار، با توکن به راه‌های ارتباطی هنرمندان برس و در چالش‌های یک‌به‌یک با رأی جامعهٔ هنری برنده شو.</p>
            <div className="hero__cta"><Button href="/auth" variant="light" arrow>ساخت پروفایل هنری</Button><Button href="/artists" variant="ghost-light">مشاهدهٔ هنرمندان</Button></div>
          </div>
          <ol className="hero__side">{STEPS.map(([n, t]) => <li key={n}><span>{n}</span><b>{t}</b></li>)}</ol>
        </div>
        <div className="container hero__stats">
          {[[s?.artists, 'هنرمند عضو'], [s?.active, 'چالش در جریان'], [s?.finished, 'چالش پایان‌یافته'], [s?.pot, 'توکن در جریان']].map(([v, l]) => <div key={l}><b>{v == null ? '—' : faNum(v)}</b><span>{l}</span></div>)}
        </div>
        <a href="#manifesto" className="hero__scroll" aria-label="ادامه">↓</a>
      </section>

      <Marquee items={CATEGORIES} />

      <section className="section container" id="manifesto">
        <SectionHead no="۰۱" eyebrow="Manifesto — بیانیه" title="هنر، وقتی دیده شود، شغل می‌شود." />
        <Reveal className="manifesto">
          <p className="manifesto__lead">بیشترِ هنرمندان خوب، دیده نمی‌شوند؛ نه چون کم‌استعدادند، بلکه چون راهِ رسیدن آثارشان به آدم‌های درست هموار نیست.</p>
          <div className="manifesto__cols">
            <p className="dropcap">آرتمون یک ویترین حرفه‌ای و یک بازار ارتباط است. هر هنرمند با ثبت‌نام و بارگذاری نمونه‌کار، پروفایلی می‌سازد که در فهرست هنرمندان دیده می‌شود. اطلاعات تماس او پنهان است و تنها کسی که واردِ شبکه شده باشد، با توکن می‌تواند آن را باز کند؛ پس هم هنرمند محافظت می‌شود و هم ارتباط، جدی و هدفمند می‌ماند.</p>
            <p>بخش دوم، چالش‌هاست: رقابتی یک‌به‌یک میان هنرمندان یک حوزه. آثار کنار هم قرار می‌گیرند، جامعهٔ هنری رأی می‌دهد و نتیجه روی پروفایل می‌نشیند. این‌گونه رقابت، به اعتبار تبدیل می‌شود.</p>
          </div>
        </Reveal>
      </section>

      <section className="section container">
        <SectionHead no="۰۲" eyebrow="Featured — برجسته" title="هنرمندانِ برجسته" aside={<Button href="/artists" variant="text" arrow>همهٔ هنرمندان</Button>} />
        <div className="featured">{(feat.data || []).map((a, i) => <ArtistCard key={a.id} a={a} size={i === 0 ? 'lg' : ''} />)}</div>
        <p className="muted note">هنرمندان با ارتقای پروفایل، در این بخش نمایش داده می‌شوند. <Link href="/profile">پروفایل خود را ارتقا دهید</Link></p>
      </section>

      <section className="section container">
        <SectionHead no="۰۳" eyebrow="Index — حوزه‌ها" title="حوزه‌های هنری" />
        <ul className="index">{CATEGORIES.map((c, i) => <li key={c}><Link href={`/artists?cat=${encodeURIComponent(c)}`}><span className="index__no">{faNum(String(i + 1).padStart(2, '0'))}</span><span className="index__name">{c}</span><i aria-hidden>←</i></Link></li>)}</ul>
      </section>

      <section className="section container">
        <SectionHead no="۰۴" eyebrow="How it works — سه گام" title="آرتمون چگونه کار می‌کند؟" />
        <div className="steps">{STEPS.map(([n, t, d]) => <Reveal key={n} className="step"><span className="step__no">{n}</span><h3 className="display-sm">{t}</h3><p>{d}</p></Reveal>)}</div>
      </section>

      <section className="arena">
        <div className="container">
          <SectionHead no="۰۵" eyebrow="The Arena — آرنا" title="چالش‌های هنری؛ هنر در میدان رقابت" aside={<Button href="/challenges" variant="light" arrow>همهٔ چالش‌ها</Button>} />
          <ol className="arena__steps">{ARENA.map(([t, d], i) => <li key={t}><span>{faNum(i + 1)}</span><b>{t}</b><p>{d}</p></li>)}</ol>
          <div className="arena__live">{(live.data || []).map((c) => <ChallengeCard key={c.id} c={c} now={now} />)}</div>
        </div>
      </section>

      <section className="section container cta">
        <img src="/logo.png" alt="" width="120" height="120" />
        <h2 className="display-lg">اولین جوانه را <em>همین امروز</em> بکار.</h2>
        <p className="lead">ثبت‌نام رایگان است؛ فقط یک نمونه‌کار کافی است.</p>
        <Button href="/auth" arrow>ساخت پروفایل هنری</Button>
      </section>
    </>
  )
}
