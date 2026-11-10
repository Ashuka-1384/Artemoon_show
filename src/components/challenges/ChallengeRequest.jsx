import { useState } from 'react'
import { challenges } from '@/services'
import { useSession } from '@/providers/SessionProvider'
import { useToast } from '@/providers/ToastProvider'
import { useRouter } from '@/lib/navigation'
import { Button, Field, Modal } from '@/components/ui'
import { CHALLENGE_WEEKS, MAX_STAKE, MIN_STAKE } from '@/lib/constants'
import { faNum } from '@/lib/format'

/** پنل «دعوت به چالش» روی پروفایل هنرمند */
export default function ChallengeRequest({ artist }) {
  const { user, balance, refresh } = useSession(); const toast = useToast(); const router = useRouter()
  const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false)
  const [f, setF] = useState({ title: '', theme: '', weeks: 2, stake: 5 }); const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const same = user?.cat === artist.cat; const own = user?.id === artist.id
  const trigger = () => { if (!user) return router.push('/auth'); setOpen(true) }
  const submit = async (e) => {
    e.preventDefault(); setBusy(true)
    try { const c = await challenges.request({ opponentId: artist.id, ...f }); await refresh(); toast('درخواست چالش ارسال شد و توکن شما تا پاسخ هنرمند نگه داشته می‌شود.'); setOpen(false); router.push(`/challenges/${c.id}`) }
    catch (err) { toast(err.message, 'warn') } finally { setBusy(false) }
  }
  if (own) return null
  return (
    <section className="invite">
      <div><span className="eyebrow">Challenge — چالش یک‌به‌یک</span><h3 className="display-sm">{artist.stage || artist.name} را به چالش دعوت کن</h3>
        <p className="muted">مدت (۱ تا ۴ هفته) و مبلغ توکن را تعیین کن. اگر پذیرفت، او هم همان مبلغ را می‌گذارد؛ برنده کل توکن‌ها را می‌برد.</p>
        {user && !same && <p className="invite__warn">فقط هنرمندان هم‌حوزه می‌توانند به هم چالش بدهند (حوزهٔ شما: {user.cat}).</p>}</div>
      <Button onClick={trigger} disabled={!!user && !same} arrow>ارسال درخواست چالش</Button>
      <Modal open={open} onClose={() => setOpen(false)} eyebrow="درخواست چالش" title={`چالش ${user?.cat || ''} با ${artist.stage || artist.name}`}>
        <form onSubmit={submit} className="form-stack">
          <Field label="عنوان چالش"><input required value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="مثلاً روایت یک خاطره" /></Field>
          <Field label="موضوع و قواعد کوتاه"><textarea required rows="3" value={f.theme} onChange={(e) => set('theme', e.target.value)} placeholder="نوع اثر و شرایط شرکت" /></Field>
          <div className="field"><span className="field__label">مدت چالش</span>
            <div className="seg">{CHALLENGE_WEEKS.map((w) => <button type="button" key={w} className={f.weeks === w ? 'is-on' : ''} onClick={() => set('weeks', w)}>{faNum(w)} هفته</button>)}</div></div>
          <Field label="توکن هر طرف" hint={`موجودی شما: ${faNum(balance)} توکن · جایزهٔ برنده: ${faNum(f.stake * 2)} توکن`}>
            <input type="number" min={MIN_STAKE} max={MAX_STAKE} required value={f.stake} onChange={(e) => set('stake', e.target.value)} /></Field>
          <Button type="submit" disabled={busy} arrow>ارسال و قفل {faNum(f.stake)} توکن</Button>
        </form>
      </Modal>
    </section>
  )
}
