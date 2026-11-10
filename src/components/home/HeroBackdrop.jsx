import { useEffect, useRef, useState } from 'react'
import { SITE } from '@/config/site'

/** پس‌زمینهٔ تیزر. اگر فایل ویدئو نبود/خطا داد، انیمیشن «طلوع ماه» جایگزین می‌شود. */
export default function HeroBackdrop() {
  const ref = useRef(null); const [failed, setFailed] = useState(!SITE.teaserSrc)
  useEffect(() => {
    const v = ref.current; if (!v) return
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (m.matches) v.pause(); else v.play?.().catch(() => {})
  }, [])
  return (
    <div className="hero__bg" aria-hidden>
      {!failed
        ? <video ref={ref} src={SITE.teaserSrc} poster={SITE.teaserPoster || undefined} autoPlay muted loop playsInline preload="auto" onError={() => setFailed(true)} />
        : <div className="moonrise"><i className="moonrise__moon" /><i className="moonrise__leaf" /></div>}
      <div className="hero__shade" /><div className="hero__grain" />
    </div>
  )
}
