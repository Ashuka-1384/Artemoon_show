import { useState } from 'react'
import { useStore, go } from './store.jsx'
import { ARTISTS, CATEGORIES, GOALS, LEVELS, PACKS, TEASER_URL } from './data.js'
import { useRef } from 'react'
import { ArtistCard, Avatar, ContactBox, Icon } from './ui.jsx'

function Hero() {
  const v = useRef(null); const [playing, setPlaying] = useState(true); const [muted, setMuted] = useState(true)
  const toggle = () => { const el = v.current; if (!el) return; if (el.paused) { el.play(); setPlaying(true) } else { el.pause(); setPlaying(false) } }
  const sound = () => { const el = v.current; if (!el) return; el.muted = !el.muted; setMuted(el.muted) }
  const feats = [['brush', 'پروفایل هنری با نمونه‌کار'], ['coin', 'دسترسی به راه‌های ارتباطی با توکن'], ['trophy', 'چالش یک‌به‌یک با رأی جامعه']]
  return <section className="hero">
    <video ref={v} src={TEASER_URL} poster="/logo.png" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
    <div className="hero-shade" />
    <div className="hero-inner">
      <div className="hero-box">
        <span className="hero-tag"><Icon n="leaf" /> شبکه حرفه‌ای هنرمندان</span>
        <h1>Artemoon</h1>
        <p className="slogan">تبدیل هنر به صنعت</p>
        <p className="hero-desc">در آرتمون پروفایل و نمونه‌کارهایت را منتشر می‌کنی، در لیست هنرمندان دیده می‌شوی و با توکن به اطلاعات تماس هنرمند دلخواهت می‌رسی. با هنرمندان هم‌حوزه‌ات هم وارد چالش می‌شوی.</p>
        <div className="hero-feats">{feats.map(([i, t]) => <div key={t} className="hero-feat"><span className="ibub"><Icon n={i} /></span>{t}</div>)}</div>
        <div className="row"><a className="btn" href="#/signup">ساخت پروفایل هنری</a><a className="btn ghost" href="#/artists">مشاهده هنرمندان</a></div>
      </div>
      <div className="hero-side">
        <div className="moon-ball"><img src="/logo.png" alt="لوگوی آرتمون" /></div>
        <div className="teaser-ctl"><span>تیزر آرتمون</span>
          <button onClick={sound} aria-label={muted ? 'پخش صدا' : 'قطع صدا'}><Icon n={muted ? 'mute' : 'vol'} /></button>
          <button onClick={toggle} aria-label={playing ? 'توقف ویدیو' : 'پخش ویدیو'}><Icon n={playing ? 'pause' : 'play'} /></button></div>
      </div>
    </div>
  </section>
}

export function Home() {
  const promoted = ARTISTS.filter(a => a.promoted)
  const how = [['۱', 'ثبت‌نام و ساخت پروفایل', 'اطلاعات حرفه‌ای و حداقل یک نمونه‌کار ثبت کنید.'], ['۲', 'دیده‌شدن در شبکه', 'پروفایل شما در لیست هنرمندان نمایش داده می‌شود.'], ['۳', 'ارتباط با توکن', 'با توکن به اطلاعات تماس هنرمند دلخواه دسترسی پیدا کنید.']]
  return <>
    <Hero />

    <section className="sec"><h2>هنرمندان برجسته</h2><p className="muted sub">هنرمندانی که با ارتقای پروفایل، در صدر نمایش هستند.</p>
      <div className="grid promo">{promoted.map(a => <ArtistCard key={a.id} a={a} />)}</div>
      <div className="row c"><a className="btn ghost" href="#/profile">می‌خواهید اینجا باشید؟ پروفایل خود را ارتقا دهید</a></div>
    </section>

    <section className="sec"><h2>حوزه‌های هنری</h2>
      <div className="pills">{CATEGORIES.map(c => <a key={c} className="pill clay" href={'#/artists?c=' + c} onClick={() => sessionStorage.setItem('cat', c)}>{c}</a>)}</div>
    </section>

    <section className="sec"><h2>آرتمون چگونه کار می‌کند؟</h2>
      <div className="grid three how">{how.map(([n, t, d]) => <div key={n} className="card clay"><span className="num">{n}</span><h3>{t}</h3><p className="muted">{d}</p></div>)}</div>
    </section>

    <section className="sec"><div className="flow clay">
      <div><h2>چالش‌های هنری</h2><p>دو هنرمند هم‌حوزه، یک مدت مشخص و مقداری توکن؛ بقیه جامعه هنری آثار را می‌بینند و رأی می‌دهند. برنده، کل توکن‌های چالش را می‌برد.</p>
        <div className="row"><a className="btn" href="#/challenges">مشاهده چالش‌های فعال</a><a className="btn ghost" href="#/challenges/mine">پنل چالش‌های من</a></div></div>
      <div className="flow-steps">{[['users','دعوت هم‌حوزه','برای هنرمند هم‌حوزه‌ات درخواست چالش بفرست.'],['clock','زمان و توکن','یک تا چهار هفته و مقدار توکن را تعیین کنید.'],['image','ثبت اثر','هر نفر یک اثر مرتبط با حوزه‌اش را بارگذاری می‌کند.'],['trophy','رأی و جایزه','بیشترین رأی، همه توکن‌ها را می‌برد.']].map(([i, t, d]) => <div key={t} className="flow-step"><span className="ibub"><Icon n={i} /></span><div><b>{t}</b>{d}</div></div>)}</div>
    </div></section>
  </>
}

export function Artists() {
  const [q, setQ] = useState(''), [cat, setCat] = useState(sessionStorage.getItem('cat') || ''), [city, setCity] = useState('')
  const cities = [...new Set(ARTISTS.map(a => a.city))]
  const list = ARTISTS.filter(a => (!cat || a.cat === cat) && (!city || a.city === city) && (a.name + a.skills).includes(q)).sort((x, y) => y.promoted - x.promoted)
  return <section className="sec page"><h1>لیست هنرمندان</h1>
    <div className="filters clay">
      <input placeholder="جست‌وجوی نام یا مهارت…" value={q} onChange={e => setQ(e.target.value)} />
      <select value={cat} onChange={e => { setCat(e.target.value); sessionStorage.setItem('cat', e.target.value) }}><option value="">همه حوزه‌ها</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
      <select value={city} onChange={e => setCity(e.target.value)}><option value="">همه شهرها</option>{cities.map(c => <option key={c}>{c}</option>)}</select>
    </div>
    <div className="grid">{list.map(a => <ArtistCard key={a.id} a={a} />)}</div>
    {!list.length && <p className="muted c">هنرمندی یافت نشد.</p>}
  </section>
}

export function ArtistProfile({ id }) {
  const a = ARTISTS.find(x => x.id === id); if (!a) return <section className="sec page"><h1>هنرمند پیدا نشد</h1></section>
  return <section className="sec page"><div className="profile">
    <div className="clay pad main">
      <div className="row"><Avatar a={a} size="xl" /><div><h1>{a.name}</h1><p className="muted">{a.cat} · {a.city} · از {a.year}</p><div className="tags"><span>{a.level}</span><span>★ {a.rating}</span></div></div></div>
      <h3>درباره هنرمند</h3><p>{a.bio}</p><h3>مهارت‌ها</h3><p>{a.skills}</p>
      <h3>نمونه‌کارها</h3><div className="works">{a.works.map((w, i) => <div key={w} className="work" style={{ background: `linear-gradient(135deg,hsl(${a.hue + i * 25} 35% 82%),hsl(${a.hue + i * 25 + 50} 28% 66%))` }}>{w}</div>)}</div><ChallengeInvite artist={a} />
    </div>
    <ContactBox a={a} />
  </div></section>
}

function ChallengeInvite({ artist }) {
  const { user } = useStore(); const [message, setMessage] = useState('')
  const send = () => {
    if (!user) { go('/signup'); return }
    if (user.cat !== artist.cat) { setMessage('فقط هنرمندان هم‌حوزه می‌توانند به یکدیگر درخواست چالش ارسال کنند.'); return }
    if ((user.stage || user.name) === artist.name) { setMessage('امکان ارسال درخواست به پروفایل خودتان وجود ندارد.'); return }
    let requests=[]; try { requests=JSON.parse(localStorage.getItem('am_requests')) || [] } catch {}
    if (requests.some(r => r.from === (user.stage || user.name) && r.to === artist.name && r.status === 'pending')) { setMessage('برای این هنرمند درخواست در انتظار پاسخ دارید.'); return }
    requests.unshift({ id: Date.now(), from: user.stage || user.name, to: artist.name, category: user.cat, title: `چالش ${user.cat} با ${artist.stage || artist.name}`, status: 'pending', text: `درخواست رقابت هنری در حوزه ${user.cat}.` })
    try { localStorage.setItem('am_requests', JSON.stringify(requests)) } catch {}
    setMessage('درخواست چالش ارسال شد؛ پس از پذیرش، چالش در پنل شما نمایش داده می‌شود.')
  }
  return <div className="invite-panel"><div><h3>به چالش دعوتش کن</h3><p className="muted">درخواست چالش فقط بین هنرمندان یک حوزه قابل ارسال است.</p></div><button className="btn" onClick={send}>ارسال درخواست چالش <Icon n="send" /></button>{message && <p className="challenge-notice">{message}</p>}</div>
}

export function Signup() {
  const { setUser, user } = useStore()
  const [f, setF] = useState({ name: '', nid: '', email: '', phone: '', pass: '', pass2: '', stage: '', cat: '', skills: '', level: '', path: '', year: '', city: '', bio: '', goals: [], wtitle: '', wtype: '', wrole: '', t1: false, t2: false, t3: false })
  const [err, setErr] = useState('')
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const toggle = g => set('goals', f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g])
  const submit = e => {
    e.preventDefault()
    if (f.pass !== f.pass2) return setErr('رمز عبور و تکرار آن یکسان نیست.')
    if (!f.t1 || !f.t2 || !f.t3) return setErr('لطفاً هر سه تأیید نهایی را انتخاب کنید.')
    setErr(''); setUser(f); go('/profile')
  }
  const R = (k, label, type = 'text') => <label>{label}<input required type={type} value={f[k]} onChange={e => set(k, e.target.value)} /></label>
  return <section className="sec page narrow"><h1>ثبت‌نام هنرمند در آرتمون</h1>
    <p className="muted">برای ساخت پروفایل حرفه‌ای، اطلاعات زیر را تکمیل کنید.</p>
    <form onSubmit={submit}>
      <fieldset className="clay pad"><legend>۰۱ — اطلاعات حساب</legend><div className="fgrid">
        {R('name', 'نام و نام خانوادگی *')}{R('nid', 'کد ملی *')}{R('email', 'ایمیل *', 'email')}{R('phone', 'شماره موبایل *', 'tel')}{R('pass', 'رمز عبور *', 'password')}{R('pass2', 'تکرار رمز عبور *', 'password')}</div></fieldset>
      <fieldset className="clay pad"><legend>۰۲ — پروفایل هنری</legend><div className="fgrid">
        <label>نام هنری<input value={f.stage} onChange={e => set('stage', e.target.value)} /></label>
        <label>حوزه اصلی *<select required value={f.cat} onChange={e => set('cat', e.target.value)}><option value="">انتخاب کنید</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
        {R('skills', 'حوزه‌های تخصصی / مهارت‌ها *')}
        <label>سطح فعالیت *<select required value={f.level} onChange={e => set('level', e.target.value)}><option value="">انتخاب کنید</option>{[...LEVELS, 'سایر'].map(c => <option key={c}>{c}</option>)}</select></label>
        <label>نوع مسیر هنری *<select required value={f.path} onChange={e => set('path', e.target.value)}><option value="">انتخاب کنید</option><option>دانشگاهی</option><option>تجربی</option><option>دانشگاهی + تجربی</option></select></label>
        <label>سال شروع فعالیت<input value={f.year} onChange={e => set('year', e.target.value)} /></label>{R('city', 'شهر محل فعالیت *')}</div></fieldset>
      <fieldset className="clay pad"><legend>۰۳ — درباره شما</legend>
        <label>خودتان را معرفی کنید *<textarea required rows="4" placeholder="در چند جمله درباره مسیر، علایق و نگاه هنری خود بنویسید." value={f.bio} onChange={e => set('bio', e.target.value)} /></label>
        <p>در حال حاضر به دنبال چه چیزی هستید؟ *</p><div className="checks">{GOALS.map(g => <label key={g} className="check"><input type="checkbox" checked={f.goals.includes(g)} onChange={() => toggle(g)} />{g}</label>)}</div></fieldset>
      <fieldset className="clay pad"><legend>۰۴ — نمونه‌کار (حداقل یک نمونه الزامی است)</legend>
        <label>آپلود نمونه‌کار اصلی * (عکس، ویدئو، صوت، PDF، متن)<input type="file" required accept="image/*,video/*,audio/*,.pdf,.txt" /></label>
        <div className="fgrid">{R('wtitle', 'عنوان اثر *')}{R('wtype', 'نوع اثر *')}{R('wrole', 'نقش شما در خلق اثر *')}<label>لینک نمونه‌کار (اختیاری)<input type="url" /></label></div>
        <small className="muted">با ارسال اثر، تأیید می‌کنید که حق ارسال و نمایش آن را در آرتمون دارید.</small></fieldset>
      <fieldset className="clay pad"><legend>۰۵ — تأیید نهایی</legend>
        <label className="check"><input type="checkbox" checked={f.t1} onChange={e => set('t1', e.target.checked)} />قوانین و شرایط استفاده را مطالعه کرده‌ام و می‌پذیرم. (<a href="#/terms">مشاهده</a>)</label>
        <label className="check"><input type="checkbox" checked={f.t2} onChange={e => set('t2', e.target.checked)} />اطلاعات واردشده متعلق به من و کاملاً صحیح است.</label>
        <label className="check"><input type="checkbox" checked={f.t3} onChange={e => set('t3', e.target.checked)} />نمونه‌کار ارسالی متعلق به من است یا حقوق لازم را دارم.</label>
        {err && <p className="err">{err}</p>}<button className="btn" type="submit">ثبت‌نام و ساخت پروفایل هنرمند</button></fieldset>
    </form>
    {user && <p className="muted c">شما قبلاً ثبت‌نام کرده‌اید؛ <a href="#/profile">رفتن به پروفایل</a></p>}
  </section>
}

export function Profile() {
  const { user, setUser, tokens, setTokens } = useStore(); const [promo, setPromo] = useState(false)
  if (!user) return <section className="sec page c"><h1>ابتدا ثبت‌نام کنید</h1><a className="btn" href="#/signup">ثبت‌نام</a></section>
  return <section className="sec page"><div className="profile">
    <div className="clay pad main">
      <div className="row"><div className="avatar xl">{user.name[0]}</div><div><h1>{user.stage || user.name}</h1><p className="muted">{user.cat} · {user.city}</p><div className="tags"><span>{user.level}</span><span>{user.path}</span></div></div></div>
      <h3>درباره من</h3><p>{user.bio}</p><h3>مهارت‌ها</h3><p>{user.skills}</p>
      <h3>اهداف</h3><div className="tags">{user.goals.map(g => <span key={g}>{g}</span>)}</div>
      <div className="row"><button className="btn ghost sm" onClick={() => alert('ویرایش پروفایل در نسخه بعد فعال می‌شود.')}>ویرایش پروفایل</button><button className="btn ghost sm" onClick={() => { setUser(null); go('/') }}>خروج</button></div>
    </div>
    <div className="contact clay-in"><h4>کیف توکن</h4><p className="big"><Icon n="coin" /> {tokens}</p><a className="btn sm" href="#/wallet">خرید توکن</a>
      <h4>ارتقای پروفایل</h4><p className="muted">با خرید جایگاه تبلیغاتی، در بخش «هنرمندان برجسته» نمایش داده شوید.</p>
      <button className="btn" onClick={() => setPromo(true)}>خرید جایگاه تبلیغاتی</button>{promo && <small className="muted">نمایشی: درگاه پرداخت در فاز بک‌اند متصل می‌شود.</small>}</div>
  </div></section>
}

export function Wallet() {
  const { tokens, setTokens, user } = useStore(); const [msg, setMsg] = useState('')
  const buy = p => { if (!user) return go('/signup'); setTokens(tokens + p.tokens); setMsg(`${p.tokens} توکن (نمایشی) به کیف شما اضافه شد.`) }
  return <section className="sec page"><h1>کیف توکن</h1>
    <div className="clay pad balance"><span>موجودی شما</span><b><Icon n="coin" /> {tokens}</b></div>
    <p className="muted">توکن‌ها اعتبار مجازی داخل پلتفرم‌اند و ارزش نقدی مستقل ندارند.</p>
    <div className="grid three">{PACKS.map(p => <div key={p.id} className={'card clay' + (p.hot ? ' hot' : '')}>{p.hot && <span className="badge">پیشنهادی</span>}<h2>{p.tokens} توکن</h2><p className="muted">{p.note}</p><p className="big">{p.price} <small>تومان</small></p><button className="btn" onClick={() => buy(p)}>خرید</button></div>)}</div>
    {msg && <p className="ok c">{msg}</p>}
  </section>
}

export function Challenges() {
  return <section className="sec page c"><h1>چالش‌ها</h1><div className="soon clay"><span className="ibub"><Icon n="trophy" /></span><h3>به زودی</h3><p className="muted">لیست چالش‌ها، ایجاد چالش، ارسال اثر و امتیازدهی به‌زودی اضافه می‌شود.</p></div></section>
}

export function Terms() {
  const t = [['حساب کاربری و استفاده قابل قبول', 'کاربران مسئول ارائه اطلاعات دقیق و حفظ امنیت حساب خود هستند. کلاهبرداری، جعل هویت، سرقت ادبی، آزار و دستکاری رتبه‌بندی ممنوع است.'], ['معرفی، پرداخت‌ها و امتیازها', 'امتیازها و توکن‌های آرتمون اعتبار مجازی پلتفرم‌اند و ارزش نقدی مستقل ندارند. بازپرداخت یا انتقال تابع قوانین آرتمون است.'], ['آثار هنری و مالکیت معنوی', 'کاربران مالک آثار خود هستند و مسئول داشتن حقوق لازم برای آپلود آن‌ها. نقض حق چاپ ممنوع است.'], ['چالش‌ها، بازار و انجمن', 'هر سرویس قوانین خاص خود را دارد و آرتمون می‌تواند محتوای ناقض را بررسی، حذف یا محدود کند.'], ['مسئولیت و تغییرات', 'آرتمون بستری برای ارتباط است و کیفیت یا پرداخت خدمات شخص ثالث را تضمین نمی‌کند. ادامه استفاده به معنی پذیرش تغییرات است.']]
  return <section className="sec page narrow"><h1>قوانین و شرایط استفاده</h1>{t.map(([h, p], i) => <div key={h} className="clay pad"><h3>{i + 1}. {h}</h3><p>{p}</p></div>)}</section>
}
