import { wallet } from '@/services'
import { useAsync } from '@/lib/hooks'
import { useSession } from '@/providers/SessionProvider'
import { useToast } from '@/providers/ToastProvider'
import { useRouter } from '@/lib/navigation'
import { PACKS, CONTACT_COST } from '@/lib/constants'
import { faMoney, faNum, fmtDate } from '@/lib/format'
import { Button, Empty, PageHead } from '@/components/ui'

export default function Wallet() {
  const { user, balance, refresh } = useSession(); const toast = useToast(); const router = useRouter()
  const tx = useAsync(() => (user ? wallet.transactions() : []), [user?.id, balance])
  const buy = async (p) => { if (!user) return router.push('/auth'); await wallet.buyPack(p.id); await refresh(); toast(`${faNum(p.tokens)} توکن (نمایشی) به کیف شما اضافه شد.`) }
  return (
    <>
      <PageHead eyebrow="Wallet — کیف توکن" title="کیف توکن" lead="توکن، اعتبار مجازی آرتمون است: برای باز کردن اطلاعات تماس و گذاشتنِ مبلغ در چالش‌ها." />
      <section className="container wallet">
        <div className="balance"><span className="eyebrow">موجودی شما</span><b>{faNum(balance)}</b><small>توکن</small>
          <p className="muted">هر بار باز کردن اطلاعات تماس {faNum(CONTACT_COST)} توکن است.</p></div>
        <div className="packs">{PACKS.map((p) => (
          <article key={p.id} className={`pack ${p.hot ? 'pack--hot' : ''}`}>{p.hot && <span className="pack__flag">پیشنهادی</span>}
            <span className="eyebrow">{p.note}</span><h3 className="pack__tokens">{faNum(p.tokens)}<small> توکن</small></h3>
            <p className="pack__price">{faMoney(p.price)} <small>تومان</small></p><Button variant={p.hot ? 'solid' : 'outline'} onClick={() => buy(p)} arrow>خرید</Button></article>))}</div>
      </section>
      <section className="container section--tight"><h2 className="eyebrow">گردش حساب</h2>
        {user && tx.data?.length ? <ul className="ledger">{tx.data.map((t) => <li key={t.id}><span>{t.note}</span><time>{fmtDate(t.at)}</time><b className={t.amount > 0 ? 'pos' : 'neg'}>{t.amount > 0 ? '+' : '−'}{faNum(Math.abs(t.amount))}</b></li>)}</ul>
          : <Empty title="هنوز تراکنشی ثبت نشده" text={user ? 'پس از اولین خرید یا خرج توکن، اینجا می‌بینید.' : 'برای دیدن گردش حساب وارد شوید.'} />}
      </section>
    </>
  )
}
