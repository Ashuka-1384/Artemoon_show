import { useEffect, useState } from 'react'
import { artists, wallet } from '@/services'
import { useSession } from '@/providers/SessionProvider'
import { useToast } from '@/providers/ToastProvider'
import { useRouter } from '@/lib/navigation'
import { Button, Modal, Eyebrow } from '@/components/ui'
import { CONTACT_COST } from '@/lib/constants'
import { faNum } from '@/lib/format'

export default function ContactVault({ artist }) {
  const { user, balance, refresh } = useSession(); const toast = useToast(); const router = useRouter()
  const [contact, setContact] = useState(null); const [confirm, setConfirm] = useState(false); const [busy, setBusy] = useState(false)
  useEffect(() => { setContact(null); if (artist.unlocked && user) artists.contact(artist.id).then(setContact).catch(() => {}) }, [artist.id, artist.unlocked, user])
  const own = user?.id === artist.id

  const click = () => {
    if (!user) return router.push('/auth')
    if (balance < CONTACT_COST) { toast('موجودی توکن کافی نیست؛ ابتدا کیف خود را شارژ کنید.', 'warn'); return router.push('/wallet') }
    setConfirm(true)
  }
  const pay = async () => {
    setBusy(true)
    try { setContact(await wallet.unlockContact(artist.id)); await refresh(); setConfirm(false); toast('اطلاعات تماس باز شد.') }
    catch (e) { toast(e.message, 'warn') } finally { setBusy(false) }
  }
  return (
    <aside className="vault">
      <Eyebrow>Contact — اطلاعات تماس</Eyebrow>
      {contact ? (
        <dl className="vault__list vault__list--open">
          <div><dt>موبایل</dt><dd dir="ltr">{contact.phone}</dd></div>
          <div><dt>ایمیل</dt><dd dir="ltr">{contact.email}</dd></div>
          {contact.telegram && <div><dt>تلگرام</dt><dd dir="ltr">{contact.telegram}</dd></div>}
          {own && <small className="muted">این اطلاعات فقط برای شما نمایش داده می‌شود.</small>}
        </dl>
      ) : (
        <>
          <dl className="vault__list" aria-hidden><div><dt>موبایل</dt><dd>۰۹۱۲ ••• ••••</dd></div><div><dt>ایمیل</dt><dd>••••••@••••.ir</dd></div><div><dt>تلگرام</dt><dd>@••••••••</dd></div></dl>
          <p className="muted vault__note">راه‌های ارتباطی هر هنرمند پنهان است و فقط برای کاربران ثبت‌نام‌شده، با خرج‌کردن {faNum(CONTACT_COST)} توکن باز می‌شود.</p>
          <Button onClick={click} className="btn--block" arrow>باز کردن راه‌های ارتباطی · {faNum(CONTACT_COST)} توکن</Button>
          {!user && <small className="muted">برای مشاهده باید ثبت‌نام کنید.</small>}
        </>
      )}
      <Modal open={confirm} onClose={() => setConfirm(false)} eyebrow="تأیید پرداخت" title="باز کردن اطلاعات تماس">
        <p>{faNum(CONTACT_COST)} توکن از موجودی شما ({faNum(balance)}) کسر می‌شود و دسترسی شما به اطلاعات {artist.stage || artist.name} دائمی است.</p>
        <div className="row"><Button onClick={pay} disabled={busy}>تأیید و پرداخت</Button><Button variant="outline" onClick={() => setConfirm(false)}>انصراف</Button></div>
      </Modal>
    </aside>
  )
}
