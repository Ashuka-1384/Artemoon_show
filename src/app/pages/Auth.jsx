import { useState } from 'react'
import { useSession } from '@/providers/SessionProvider'
import { useToast } from '@/providers/ToastProvider'
import { useQuery, useRouter } from '@/lib/navigation'
import { CATEGORIES, GOALS, LEVELS, PATHS } from '@/lib/constants'
import { Button, Eyebrow, Field } from '@/components/ui'

const EMPTY = { name: '', nid: '', email: '', phone: '', pass: '', pass2: '', stage: '', cat: '', skills: '', level: '', path: '', year: '', city: '', bio: '', goals: [], wtitle: '', wtype: '', wrole: '', wlink: '', fileName: '', t1: false, t2: false, t3: false }
const SECTIONS = ['اطلاعات حساب', 'پروفایل هنری', 'دربارهٔ شما', 'نمونه‌کار', 'تأیید نهایی']

export default function Auth() {
  const [sp, setSp] = useQuery(); const mode = sp.get('mode') === 'login' ? 'login' : 'register'
  return (
    <div className="container auth">
      <div className="auth__tabs"><button className={mode === 'register' ? 'is-on' : ''} onClick={() => setSp({})}>ثبت‌نام هنرمند</button><button className={mode === 'login' ? 'is-on' : ''} onClick={() => setSp({ mode: 'login' })}>ورود</button></div>
      {mode === 'login' ? <Login /> : <Register />}
    </div>
  )
}

function Login() {
  const { login } = useSession(); const router = useRouter(); const toast = useToast(); const [f, setF] = useState({ email: '', pass: '' })
  const submit = async (e) => { e.preventDefault(); try { await login(f.email, f.pass); router.push('/profile') } catch (err) { toast(err.message, 'warn') } }
  return (
    <div className="auth__narrow"><Eyebrow>Sign in — ورود</Eyebrow><h1 className="display-lg">خوش برگشتی.</h1>
      <form className="form-stack" onSubmit={submit}>
        <Field label="ایمیل"><input type="email" required dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="رمز عبور"><input type="password" required dir="ltr" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} /></Field>
        <Button type="submit" arrow>ورود</Button>
      </form></div>
  )
}

function Register() {
  const { register } = useSession(); const router = useRouter(); const toast = useToast()
  const [f, setF] = useState(EMPTY); const [busy, setBusy] = useState(false)
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const toggle = (g) => set('goals', f.goals.includes(g) ? f.goals.filter((x) => x !== g) : [...f.goals, g])
  const T = (k, label, type = 'text', extra = {}) => <Field label={label}><input required type={type} value={f[k]} onChange={(e) => set(k, e.target.value)} {...extra} /></Field>
  const submit = async (e) => {
    e.preventDefault()
    if (!f.goals.length) return toast('دست‌کم یک هدف را انتخاب کنید.', 'warn')
    if (!f.t1 || !f.t2 || !f.t3) return toast('هر سه تأیید نهایی لازم است.', 'warn')
    setBusy(true)
    try { await register(f); toast('پروفایل شما ساخته شد.'); router.push('/profile') } catch (err) { toast(err.message, 'warn') } finally { setBusy(false) }
  }
  return (
    <div className="auth__layout">
      <aside className="auth__index"><Eyebrow>Contents</Eyebrow><ol>{SECTIONS.map((s, i) => <li key={s}><a href={`#sec-${i + 1}`}><span>{`۰${i + 1}`}</span>{s}</a></li>)}</ol>
        <p className="muted">اطلاعات تماس شما (موبایل، ایمیل، تلگرام) در پروفایل عمومی پنهان می‌ماند.</p></aside>
      <form className="auth__form" onSubmit={submit}>
        <header><Eyebrow>Join — عضویت</Eyebrow><h1 className="display-lg">پروفایل هنری‌ات را بساز.</h1><p className="lead">برای ساخت پروفایل حرفه‌ای، اطلاعات زیر را تکمیل کن.</p></header>
        <fieldset id="sec-1"><legend><span>۰۱</span>اطلاعات حساب</legend><div className="fgrid">
          {T('name', 'نام و نام خانوادگی *')}{T('nid', 'کد ملی *', 'text', { inputMode: 'numeric', dir: 'ltr' })}{T('email', 'ایمیل *', 'email', { dir: 'ltr' })}{T('phone', 'شمارهٔ موبایل *', 'tel', { dir: 'ltr' })}{T('pass', 'رمز عبور *', 'password', { dir: 'ltr', minLength: 6 })}{T('pass2', 'تکرار رمز عبور *', 'password', { dir: 'ltr' })}</div></fieldset>
        <fieldset id="sec-2"><legend><span>۰۲</span>پروفایل هنری</legend><div className="fgrid">
          <Field label="نام هنری"><input value={f.stage} onChange={(e) => set('stage', e.target.value)} /></Field>
          <Field label="حوزهٔ اصلی *"><select required value={f.cat} onChange={(e) => set('cat', e.target.value)}><option value="">انتخاب کنید</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          {T('skills', 'حوزه‌های تخصصی / مهارت‌ها *')}
          <Field label="سطح فعالیت *"><select required value={f.level} onChange={(e) => set('level', e.target.value)}><option value="">انتخاب کنید</option>{[...LEVELS, 'سایر'].map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="نوع مسیر هنری *"><select required value={f.path} onChange={(e) => set('path', e.target.value)}><option value="">انتخاب کنید</option>{PATHS.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="سال شروع فعالیت"><input value={f.year} onChange={(e) => set('year', e.target.value)} placeholder="مثلاً ۱۳۹۸" /></Field>
          {T('city', 'شهر محل فعالیت *')}</div></fieldset>
        <fieldset id="sec-3"><legend><span>۰۳</span>دربارهٔ شما</legend>
          <Field label="خودتان را معرفی کنید *"><textarea required rows="5" value={f.bio} onChange={(e) => set('bio', e.target.value)} placeholder="در چند جمله دربارهٔ مسیر، علایق و نگاه هنری خود بنویسید." /></Field>
          <p className="field__label">در حال حاضر به دنبال چه چیزی هستید؟ *</p>
          <div className="checks">{GOALS.map((g) => <label key={g} className={`check ${f.goals.includes(g) ? 'is-on' : ''}`}><input type="checkbox" checked={f.goals.includes(g)} onChange={() => toggle(g)} />{g}</label>)}</div></fieldset>
        <fieldset id="sec-4"><legend><span>۰۴</span>نمونه‌کار <small>حداقل یک نمونه الزامی است</small></legend>
          <label className="drop"><input type="file" required accept="image/*,video/*,audio/*,.pdf,.txt" onChange={(e) => set('fileName', e.target.files?.[0]?.name || '')} />
            <b>{f.fileName || 'انتخاب فایل نمونه‌کار اصلی *'}</b><small>عکس، ویدئو، صوت، PDF یا متن — آپلود واقعی با اتصال بک‌اند فعال می‌شود</small></label>
          <div className="fgrid">{T('wtitle', 'عنوان اثر *')}{T('wtype', 'نوع اثر *')}{T('wrole', 'نقش شما در خلق اثر *')}<Field label="لینک نمونه‌کار (اختیاری)"><input type="url" dir="ltr" value={f.wlink} onChange={(e) => set('wlink', e.target.value)} /></Field></div></fieldset>
        <fieldset id="sec-5"><legend><span>۰۵</span>تأیید نهایی</legend>
          {[['t1', 'قوانین و شرایط استفاده را مطالعه کرده‌ام و می‌پذیرم.'], ['t2', 'اطلاعات واردشده متعلق به من و کاملاً صحیح است.'], ['t3', 'نمونه‌کار ارسالی متعلق به من است یا حقوق لازم را دارم.']].map(([k, t]) => <label key={k} className="check"><input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} />{t}</label>)}
          <Button type="submit" disabled={busy} arrow>ثبت‌نام و ساخت پروفایل</Button></fieldset>
      </form>
    </div>
  )
}
