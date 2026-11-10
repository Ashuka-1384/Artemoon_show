import { artists } from '@/services'
import { useAsync } from '@/lib/hooks'
import { useParams } from '@/lib/navigation'
import { Button, Empty, Loading, Tag } from '@/components/ui'
import ArtPlate from '@/components/artwork/ArtPlate'
import ContactVault from '@/components/artists/ContactVault'
import ChallengeRequest from '@/components/challenges/ChallengeRequest'
import { faNum } from '@/lib/format'

export default function ArtistProfile() {
  const { id } = useParams(); const { data: a, loading, error } = useAsync(() => artists.get(id), [id])
  if (loading && !a) return <div className="container section"><Loading /></div>
  if (error || !a) return <div className="container section"><Empty title="هنرمند پیدا نشد" action={<Button href="/artists" variant="outline">بازگشت به فهرست</Button>} /></div>
  return (
    <div className="container profile">
      <article className="profile__main">
        <header className="profile__head">
          <ArtPlate seed={a.id + a.name} ratio="1 / 1" className="profile__portrait" />
          <div>
            <span className="eyebrow">{a.cat}</span>
            <h1 className="display-lg">{a.stage || a.name}</h1>
            {a.stage && <p className="muted">{a.name}</p>}
            <p className="meta">{a.city} · از سال {faNum(a.year || '—')}</p>
            <div className="tags"><Tag>{a.level}</Tag>{a.path && <Tag>{a.path}</Tag>}{a.rating !== '—' && <Tag tone="live">★ {faNum(a.rating)}</Tag>}</div>
          </div>
        </header>
        <section className="prose"><h2 className="eyebrow">درباره</h2><p className="dropcap">{a.bio}</p></section>
        <section className="prose"><h2 className="eyebrow">مهارت‌ها</h2><p>{a.skills}</p></section>
        <section><h2 className="eyebrow">نمونه‌کارها</h2>
          <div className="works">{(a.works || []).map((w, i) => <figure key={w + i}><ArtPlate seed={a.id + w + i} /><figcaption>{w}</figcaption></figure>)}</div></section>
        <ChallengeRequest artist={a} />
      </article>
      <ContactVault artist={a} />
    </div>
  )
}
