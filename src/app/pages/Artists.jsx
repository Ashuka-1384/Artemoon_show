import { useState } from 'react'
import { artists } from '@/services'
import { useAsync } from '@/lib/hooks'
import { useQuery } from '@/lib/navigation'
import { CATEGORIES } from '@/lib/constants'
import { faNum } from '@/lib/format'
import { Empty, Loading, PageHead } from '@/components/ui'
import ArtistCard from '@/components/artists/ArtistCard'

export default function Artists() {
  const [sp, setSp] = useQuery(); const cat = sp.get('cat') || ''
  const [q, setQ] = useState(''); const [city, setCity] = useState('')
  const list = useAsync(() => artists.list({ q, cat, city }), [q, cat, city]); const cities = useAsync(() => artists.cities())
  const setCat = (c) => setSp(c ? { cat: c } : {})
  return (
    <>
      <PageHead eyebrow="Directory — فهرست" title="هنرمندان" lead="پروفایل‌ها را بگرد؛ اطلاعات تماسِ هر هنرمند با توکن باز می‌شود." aside={<span className="count">{faNum((list.data || []).length)} هنرمند</span>} />
      <div className="container filters">
        <div className="filters__row">
          <label className="search"><span aria-hidden>⌕</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجوی نام یا مهارت…" /></label>
          <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="شهر"><option value="">همهٔ شهرها</option>{(cities.data || []).map((c) => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="chips" role="tablist">{['', ...CATEGORIES].map((c) => <button key={c || 'all'} className={cat === c ? 'is-on' : ''} onClick={() => setCat(c)}>{c || 'همه'}</button>)}</div>
      </div>
      <section className="container section--tight">
        {list.loading && !list.data ? <Loading /> : list.data?.length ? <div className="agrid">{list.data.map((a) => <ArtistCard key={a.id} a={a} />)}</div> : <Empty title="هنرمندی پیدا نشد" text="فیلترها را تغییر دهید." />}
      </section>
    </>
  )
}
