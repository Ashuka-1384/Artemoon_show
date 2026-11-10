import { useState } from 'react'
import { challenges } from '@/services'
import { useAsync, useNow } from '@/lib/hooks'
import { useParams } from '@/lib/navigation'
import { useSession } from '@/providers/SessionProvider'
import { useToast } from '@/providers/ToastProvider'
import { SITE } from '@/config/site'
import { WORK_KINDS } from '@/lib/constants'
import { faNum, fmtDate, timeLeft } from '@/lib/format'
import { Button, Empty, Eyebrow, Field, Loading, Tag } from '@/components/ui'
import ArtPlate, { kindGlyph } from '@/components/artwork/ArtPlate'

export default function ChallengeDetail() {
  const { id } = useParams(); const { user, refresh } = useSession(); const toast = useToast(); const now = useNow(30000)
  const { data: c, loading, error, reload } = useAsync(() => challenges.get(id), [id, user?.id])
  const [form, setForm] = useState({ title: '', desc: '', kind: 'تصویر', fileName: '' })
  if (loading && !c) return <div className="container section"><Loading /></div>
  if (error || !c) return <div className="container section"><Empty title="چالش پیدا نشد" action={<Button href="/challenges" variant="outline">بازگشت به چالش‌ها</Button>} /></div>

  const run = async (fn, msg) => { try { await fn(); await refresh(); reload(); msg && toast(msg) } catch (e) { toast(e.message, 'warn') } }
  const me = c.myRole; const active = c.status === 'active'; const fin = c.status === 'finished'
  const people = [['challenger', c.challenger, c.challengerId], ['opponent', c.opponent, c.opponentId]]
  const canVote = active && user && !me && !c.hasVoted
  const winner = fin && c.winnerId ? (c.winnerId === c.challengerId ? c.challenger : c.opponent) : null
  const status = { pending: 'در انتظار پذیرش', active: `در جریان · ${timeLeft(c.endsAt, now)} مانده`, finished: 'پایان‌یافته', declined: 'ردشده', cancelled: 'لغوشده' }[c.status]
  const submit = (e) => { e.preventDefault(); run(() => challenges.submitEntry(c.id, form), 'اثر شما ثبت شد.') }

  return (
    <div className="container cdetail">
      <a className="back" href="/challenges" onClick={(e) => { e.preventDefault(); history.back() }}>→ بازگشت</a>
      <header className="cdetail__head">
        <div className="tags"><Tag>{c.category}</Tag><Tag tone={active ? 'live' : fin ? 'done' : ''}>{active && <i />} {status}</Tag></div>
        <h1 className="display-xl">{c.title}</h1><p className="lead">{c.theme}</p>
        <dl className="facts">
          <div><dt>جایزهٔ برنده</dt><dd>{faNum(c.pot)} توکن</dd></div><div><dt>مبلغ هر طرف</dt><dd>{faNum(c.stake)} توکن</dd></div>
          <div><dt>مدت</dt><dd>{faNum(c.weeks)} هفته</dd></div><div><dt>{fin ? 'پایان' : 'پایان چالش'}</dt><dd>{c.endsAt ? fmtDate(c.endsAt) : '—'}</dd></div><div><dt>مجموع آرا</dt><dd>{faNum(c.totalVotes)}</dd></div>
        </dl>
      </header>

      {fin && <div className={`verdict ${winner ? '' : 'verdict--draw'}`}><Eyebrow light>Result — نتیجه</Eyebrow>
        <h2 className="display-md">{winner ? `برنده: ${winner.stage || winner.name}` : c.result === 'void' ? 'چالش بدون اثر پایان یافت' : 'تساوی آرا'}</h2>
        <p>{winner ? `${faNum(c.pot)} توکن به کیف او منتقل شد.${c.result === 'forfeit' ? ' (رقیب اثری ثبت نکرد)' : ''}` : 'توکن هر دو طرف بازگردانده شد.'}</p></div>}

      {c.status === 'pending' && <div className="notice"><b>این چالش منتظر پاسخ {me === 'challenger' ? c.opponent?.stage || c.opponent?.name : 'شماست'} است.</b>
        <div className="row">
          {me === 'opponent' && <><Button size="sm" onClick={() => run(() => challenges.respond(c.id, true), 'چالش آغاز شد.')}>پذیرش و قفل {faNum(c.stake)} توکن</Button><Button size="sm" variant="outline" onClick={() => run(() => challenges.respond(c.id, false), 'رد شد.')}>رد</Button></>}
          {me === 'challenger' && <Button size="sm" variant="outline" onClick={() => run(() => challenges.cancel(c.id), 'لغو شد.')}>لغو و بازگشت توکن</Button>}
        </div></div>}

      <section className="board" aria-label="آثار چالش">
        {people.map(([role, p, pid], i) => {
          const e = c.entries[pid]; const isWin = fin && c.winnerId === pid; const pct = c.totalVotes ? Math.round(((e?.votes || 0) / c.totalVotes) * 100) : 0
          return (
            <article key={pid} className={`entry ${isWin ? 'is-winner' : ''}`}>
              <header className="entry__who"><span className="mono-av mono-av--lg">{(p?.stage || p?.name || '?')[0]}</span><div><b>{p?.stage || p?.name}</b><small className="muted">{role === 'challenger' ? 'چالش‌دهنده' : 'رقیب'}{me && c[me === 'challenger' ? 'challengerId' : 'opponentId'] === pid ? ' · شما' : ''}</small></div>{isWin && <Tag tone="live">برنده</Tag>}</header>
              {e ? (<>
                <ArtPlate seed={c.id + pid} ratio="4 / 5" glyph={kindGlyph(e.kind)} />
                <h3 className="display-sm">{e.title}</h3><p className="muted">{e.desc} · {e.kind}</p>
                <div className="meter" aria-label={`${pct}٪ رأی`}><i style={{ width: `${pct}%` }} /></div>
                <div className="entry__foot"><span className="entry__votes">{faNum(e.votes)} <small>رأی · {faNum(pct)}٪</small></span>
                  {active && !me && <Button size="sm" disabled={!user ? false : !canVote} onClick={() => (user ? run(() => challenges.vote(c.id, pid), 'رأی شما ثبت شد.') : toast('برای رأی‌دادن وارد شوید.', 'warn'))}>{c.hasVoted ? 'رأی داده‌اید' : 'رأی به این اثر'}</Button>}</div>
              </>) : <div className="entry__empty"><span aria-hidden>◌</span><b>اثر هنوز ثبت نشده</b><small className="muted">{active ? 'شرکت‌کننده باید پیش از پایان مدت اثر خود را بارگذاری کند.' : 'پس از شروع چالش، اثر اینجا نمایش داده می‌شود.'}</small></div>}
            </article>)
        })}
      </section>

      <div className="cdetail__cols">
        {active && me && (
          <form className="panel form-stack" onSubmit={submit}><Eyebrow>Your entry — اثر شما</Eyebrow><h3 className="display-sm">{c.entries[user.id] ? 'ویرایش اثر' : 'بارگذاری اثر'}</h3>
            <p className="muted">اثری مرتبط با حوزهٔ «{c.category}» ثبت کنید. تا پیش از اولین رأی، قابل ویرایش است.</p>
            <Field label="عنوان اثر"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="نوع اثر"><select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>{WORK_KINDS.map((k) => <option key={k}>{k}</option>)}</select></Field>
            <Field label="توضیحات"><textarea required rows="3" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></Field>
            <label className="drop"><input type="file" accept="image/*,video/*,audio/*,.pdf,.txt" onChange={(e) => setForm({ ...form, fileName: e.target.files?.[0]?.name || '' })} /><b>{form.fileName || 'انتخاب فایل اثر'}</b><small>آپلود واقعی با اتصال بک‌اند فعال می‌شود</small></label>
            <Button type="submit" arrow>ثبت اثر</Button></form>)}
        <aside className="panel rules"><Eyebrow>Rules — قواعد</Eyebrow><ul><li>هر کاربر در هر چالش فقط یک رأی دارد.</li><li>شرکت‌کنندگان نمی‌توانند رأی بدهند.</li><li>پایان مدت، پررأی‌ترین اثر برنده است و همهٔ توکن‌ها را می‌برد.</li><li>تساوی آرا: توکن هر دو بازمی‌گردد.</li><li>اگر یکی از دو طرف اثر نگذارد، دیگری برنده است.</li></ul>
          {!user && <Button href="/auth" variant="outline" size="sm">برای رأی دادن وارد شوید</Button>}</aside>
        {SITE.demo && me && c.status !== 'finished' && c.status !== 'declined' && c.status !== 'cancelled' && (
          <aside className="panel demo"><Eyebrow>Demo — شبیه‌ساز</Eyebrow><p className="muted">فقط تا زمان اتصال بک‌اند: رفتار رقیب و زمان را شبیه‌سازی کنید.</p>
            <div className="row">
              {c.status === 'pending' && <Button size="sm" variant="outline" onClick={() => run(() => challenges.demo(c.id, 'accept'))}>رقیب می‌پذیرد</Button>}
              {active && <><Button size="sm" variant="outline" onClick={() => run(() => challenges.demo(c.id, 'entry'))}>رقیب اثر می‌گذارد</Button><Button size="sm" variant="outline" onClick={() => run(() => challenges.demo(c.id, 'votes'))}>افزودن رأی</Button><Button size="sm" onClick={() => run(() => challenges.demo(c.id, 'finish'), 'چالش پایان یافت.')}>پایان مدت</Button></>}
            </div></aside>)}
      </div>
    </div>
  )
}
