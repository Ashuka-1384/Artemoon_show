import { Link } from '@/lib/navigation'
import ArtPlate from '@/components/artwork/ArtPlate'

export default function ArtistCard({ a, size = '' }) {
  return (
    <Link href={`/artists/${a.id}`} className={`acard ${size ? 'acard--' + size : ''}`}>
      <div className="acard__plate">
        <ArtPlate seed={a.id + a.name} ratio={size === 'lg' ? '4 / 5' : '4 / 5'} />
        {a.promoted && <span className="acard__badge">برجسته</span>}
      </div>
      <div className="acard__body">
        <span className="eyebrow">{a.cat}</span>
        <h3 className="acard__name">{a.stage || a.name}</h3>
        <p className="muted">{a.city} · {a.level}</p>
        <span className="acard__more">مشاهدهٔ پروفایل <i aria-hidden>←</i></span>
      </div>
    </Link>
  )
}
