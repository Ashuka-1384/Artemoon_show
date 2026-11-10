export default function Marquee({ items }) {
  const row = items.map((c) => <span key={c}>{c}<i aria-hidden>✦</i></span>)
  return <div className="marquee" aria-hidden><div className="marquee__track"><div>{row}</div><div>{row}</div></div></div>
}
