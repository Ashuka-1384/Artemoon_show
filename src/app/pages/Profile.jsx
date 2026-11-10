import { useState } from 'react'
import { wallet } from '@/services'
import { useAsync } from '@/lib/hooks'
import { useSession } from '@/providers/SessionProvider'
import { useRouter } from '@/lib/navigation'
import { Button, Empty, Modal, Tag } from '@/components/ui'
import ArtPlate from '@/components/artwork/ArtPlate'
import { faNum, fmtDate } from '@/lib/format'

export default function Profile() {
  const { user, balance, logout, ready } = useSession(); const router = useRouter(); const [promo, setPromo] = useState(false)
  const tx = useAsync(() => (user ? wallet.transactions() : []), [user?.id, balance])
  if (!ready) return null
  if (!user) return <div className="container section"><Empty title="ابتدا وارد شوید" text="برای دیدن پروفایل باید ثبت‌نام کرده باشید." action={<Button href="/auth" arrow>ثبت‌نام / ورود</Button>} /></div>
  return (
    <div className="container profile">
      <article className="profile__main">
        <header className="profile__head">
          <ArtPlate seed={user.id + user.name} ratio="1 / 1" className="profile__portrait" />
          <div><span className="eyebrow">{user.cat}</span><h1 className="display-lg">{user.stage || user.name}</h1><p className="muted">{user.name}</p><p className="meta">{user.city}</p>
            <div className="tags"><Tag>{user.level}</Tag><Tag>{user.path}</Tag></div></div>
        </header>
        <section className="prose"><h2 className="eyebrow">دربارهٔ من</h2><p className="dropcap">{user.bio}</p></section>
        <section className="prose"><h2 className="eyebrow">مهارت‌ها</h2><p>{user.skills}</p></section>
        <section className="prose"><h2 className="eyebrow">اهداف</h2><div className="tags">{user.goals?.map((g) => <Tag key={g}>{g}</Tag>)}</div></section>
        <section className="prose"><h2 className="eyebrow">اطلاعات تماس من (فقط برای شما)</h2><p dir="ltr" className="meta">{user.phone} · {user.email}</p></section>
        <div className="row"><Button variant="outline" size="sm" onClick={() => alert('ویرایش پروفایل در نسخهٔ بعد فعال می‌شود.')}>ویرایش پروفایل</Button><Button variant="outline" size="sm" onClick={async () => { await logout(); router.push('/') }}>خروج</Button></div>
      </article>
      <aside className="vault">
        <span className="eyebrow">Wallet — کیف توکن</span><p className="vault__big">{faNum(balance)}<small> توکن</small></p><Button href="/wallet" size="sm">خرید توکن</Button>
        <h3 className="eyebrow">گردش اخیر</h3>
        <ul className="ledger ledger--mini">{(tx.data || []).slice(0, 4).map((t) => <li key={t.id}><span>{t.note}</span><b className={t.amount > 0 ? 'pos' : 'neg'}>{t.amount > 0 ? '+' : '−'}{faNum(Math.abs(t.amount))}</b></li>)}{!tx.data?.length && <li className="muted">هنوز تراکنشی نیست.</li>}</ul>
        <h3 className="eyebrow">ارتقای پروفایل</h3><p className="muted">با خرید جایگاه تبلیغاتی در بخش «هنرمندان برجسته» نمایش داده شوید.</p>
        <Button variant="outline" onClick={() => setPromo(true)}>خرید جایگاه تبلیغاتی</Button>
        <Modal open={promo} onClose={() => setPromo(false)} eyebrow="به‌زودی" title="جایگاه تبلیغاتی"><p>درگاه پرداخت در فاز بک‌اند متصل می‌شود.</p></Modal>
        <small className="muted">عضو از {fmtDate(user.createdAt)}</small>
      </aside>
    </div>
  )
}
