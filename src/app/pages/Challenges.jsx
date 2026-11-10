import { useState } from 'react'
import { challenges } from '@/services'
import { useAsync, useNow } from '@/lib/hooks'
import { useSession } from '@/providers/SessionProvider'
import { CATEGORIES } from '@/lib/constants'
import { faNum } from '@/lib/format'
import { Button, Empty, Loading, PageHead } from '@/components/ui'
import ChallengeCard from '@/components/challenges/ChallengeCard'

const TABS = [['all', 'همه'], ['active', 'در جریان'], ['finished', 'پایان‌یافته']]
export default function Challenges() {
  const { user } = useSession(); const now = useNow()
  const [status, setStatus] = useState('all'); const [cat, setCat] = useState(''); const [q, setQ] = useState('')
  const { data, loading } = useAsync(() => challenges.list({ status, category: cat, q }), [status, cat, q])
  return (
    <>
      <PageHead eyebrow="The Arena — آرنا" title="چالش‌ها" lead="همهٔ چالش‌های یک‌به‌یکِ هنرمندان؛ آثار را ببین و به برترین رأی بده."
        aside={<Button href={user ? `/artists?cat=${encodeURIComponent(user.cat)}` : '/auth'} arrow>یک هنرمند را به چالش دعوت کن</Button>} />
      <div className="container filters">
        <div className="filters__row">
          <div className="seg">{TABS.map(([k, t]) => <button key={k} className={status === k ? 'is-on' : ''} onClick={() => setStatus(k)}>{t}</button>)}</div>
          <label className="search"><span aria-hidden>⌕</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجوی عنوان یا موضوع…" /></label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="حوزه"><option value="">همهٔ حوزه‌ها</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
      </div>
      <section className="container section--tight">
        <p className="count">{faNum((data || []).length)} چالش</p>
        {loading && !data ? <Loading /> : data?.length ? <div className="cgrid">{data.map((c) => <ChallengeCard key={c.id} c={c} now={now} />)}</div> : <Empty title="چالشی پیدا نشد" text="فیلترها را تغییر دهید." />}
      </section>
    </>
  )
}
