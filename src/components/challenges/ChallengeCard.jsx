import { Link } from '@/lib/navigation'
import { Tag } from '@/components/ui'
import { faNum, timeLeft } from '@/lib/format'

export function Side({ person, votes, total, winner, align }) {
  const pct = total ? Math.round((votes / total) * 100) : 50
  return (
    <div className={`vs__side vs__side--${align} ${winner ? 'is-winner' : ''}`}>
      <span className="mono-av">{(person?.stage || person?.name || '?')[0]}</span>
      <b>{person?.stage || person?.name}</b>
      {votes != null && <small>{faNum(votes)} رأی · {faNum(pct)}٪</small>}
    </div>
  )
}

export default function ChallengeCard({ c, now }) {
  const [a, b] = [c.entries[c.challengerId]?.votes ?? 0, c.entries[c.opponentId]?.votes ?? 0]
  const fin = c.status === 'finished'
  return (
    <Link href={`/challenges/${c.id}`} className="ccard">
      <div className="ccard__top"><Tag>{c.category}</Tag>{fin ? <Tag tone="done">پایان‌یافته</Tag> : <Tag tone="live"><i /> {c.status === 'pending' ? 'در انتظار پذیرش' : `${timeLeft(c.endsAt, now)} مانده`}</Tag>}</div>
      <h3 className="ccard__title">{c.title}</h3>
      <p className="muted ccard__theme">{c.theme}</p>
      <div className="vs">
        <Side person={c.challenger} votes={c.status === 'pending' ? null : a} total={c.totalVotes} winner={fin && c.winnerId === c.challengerId} align="a" />
        <span className="vs__mid">VS</span>
        <Side person={c.opponent} votes={c.status === 'pending' ? null : b} total={c.totalVotes} winner={fin && c.winnerId === c.opponentId} align="b" />
      </div>
      <div className="ccard__foot"><span>جایزه: <b>{faNum(c.pot)} توکن</b></span><span>{faNum(c.weeks)} هفته</span><span className="ccard__go">مشاهده <i aria-hidden>←</i></span></div>
    </Link>
  )
}
