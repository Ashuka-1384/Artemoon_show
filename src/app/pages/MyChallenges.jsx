import { challenges } from '@/services'
import { useAsync, useNow } from '@/lib/hooks'
import { useSession } from '@/providers/SessionProvider'
import { useToast } from '@/providers/ToastProvider'
import { Button, Empty, Loading, PageHead, Tag } from '@/components/ui'
import ChallengeCard from '@/components/challenges/ChallengeCard'
import { faNum, fmtDate } from '@/lib/format'

export default function MyChallenges() {
  const { user, ready, refresh } = useSession(); const toast = useToast(); const now = useNow()
  const { data, loading, reload } = useAsync(() => (user ? challenges.mine() : null), [user?.id])
  if (!ready) return null
  if (!user) return <div className="container section"><Empty title="پنل چالش‌های شما" text="برای دیدن درخواست‌ها و مدیریت چالش‌ها ابتدا وارد شوید." action={<Button href="/auth" arrow>ثبت‌نام / ورود</Button>} /></div>
  const act = async (fn, msg) => { try { await fn(); await refresh(); reload(); toast(msg) } catch (e) { toast(e.message, 'warn') } }
  const d = data
  return (
    <>
      <PageHead eyebrow="Your space — پنل من" title="چالش‌های من" lead="درخواست‌ها، رقابت‌های فعال و نتیجهٔ چالش‌هایت را از اینجا مدیریت کن." aside={<Button href="/challenges" variant="outline">دیدن همهٔ چالش‌ها</Button>} />
      {loading && !d ? <div className="container"><Loading /></div> : d && (
        <div className="container mine">
          <div className="metrics">{[['درخواست دریافتی', d.incoming.length], ['درخواست ارسالی', d.outgoing.length], ['در جریان', d.active.length], ['پایان‌یافته', d.finished.length]].map(([l, v]) => <div key={l}><b>{faNum(v)}</b><span>{l}</span></div>)}</div>

          <section><h2 className="eyebrow">درخواست‌های دریافتی</h2>
            {d.incoming.length ? d.incoming.map((c) => (
              <article className="req" key={c.id}>
                <div><Tag>{c.category}</Tag><h3 className="display-sm">{c.title}</h3><p>{c.challenger?.stage || c.challenger?.name} شما را به چالش دعوت کرده است — {faNum(c.weeks)} هفته · هر طرف {faNum(c.stake)} توکن · جایزه {faNum(c.pot)} توکن</p><small className="muted">{c.theme}</small></div>
                <div className="row"><Button size="sm" onClick={() => act(() => challenges.respond(c.id, true), 'چالش پذیرفته شد و آغاز گردید.')}>پذیرش و قفل {faNum(c.stake)} توکن</Button><Button size="sm" variant="outline" onClick={() => act(() => challenges.respond(c.id, false), 'درخواست رد شد.')}>رد</Button></div>
              </article>)) : <Empty title="درخواست جدیدی ندارید" />}
          </section>

          {d.outgoing.length > 0 && <section><h2 className="eyebrow">درخواست‌های ارسالی</h2>{d.outgoing.map((c) => (
            <article className="req" key={c.id}><div><Tag tone="live">در انتظار پاسخ</Tag><h3 className="display-sm">{c.title}</h3><p>مخاطب: {c.opponent?.stage || c.opponent?.name} · {faNum(c.stake)} توکن شما قفل است · {fmtDate(c.createdAt)}</p></div>
              <div className="row"><Button size="sm" variant="outline" href={`/challenges/${c.id}`}>جزئیات</Button><Button size="sm" variant="outline" onClick={() => act(() => challenges.cancel(c.id), 'درخواست لغو و توکن برگردانده شد.')}>لغو درخواست</Button></div></article>))}</section>}

          <section><h2 className="eyebrow">چالش‌های در جریان</h2>
            {d.active.length ? <div className="cgrid">{d.active.map((c) => <ChallengeCard key={c.id} c={c} now={now} />)}</div> : <Empty title="چالش فعالی ندارید" text="از پروفایل یک هنرمند هم‌حوزه، درخواست چالش بفرستید." action={<Button href="/artists" variant="outline">فهرست هنرمندان</Button>} />}</section>

          {d.finished.length > 0 && <section><h2 className="eyebrow">پایان‌یافته</h2><div className="cgrid">{d.finished.map((c) => <ChallengeCard key={c.id} c={c} now={now} />)}</div></section>}
        </div>)}
    </>
  )
}
