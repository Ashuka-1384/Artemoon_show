// پلاک هنریِ تولیدی (SVG) با پالت لوگو: ماهِ خاکستری + جوانهٔ سبز. بر پایهٔ seed ثابت است؛
// تا زمان اتصال بک‌اند و آپلود واقعی، جای نمونه‌کارها را می‌گیرد.
const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }
const rng = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
const THEMES = [
  { bg: '#E9E6E2', moon: '#979394', cr: '#6f6d6f', leaf: '#5C7B3E', line: '#333235' },
  { bg: '#1c1b1d', moon: '#6f6d6f', cr: '#333235', leaf: '#8FA873', line: '#F7F6F3' },
  { bg: '#E3E9D8', moon: '#B9B5B6', cr: '#979394', leaf: '#3B5224', line: '#3B5224' },
  { bg: '#B9B5B6', moon: '#F7F6F3', cr: '#dcd8d6', leaf: '#3B5224', line: '#1c1b1d' },
  { bg: '#3B5224', moon: '#E9E6E2', cr: '#B9B5B6', leaf: '#8FA873', line: '#F7F6F3' },
]
export default function ArtPlate({ seed = 'x', ratio = '4 / 5', glyph, className = '' }) {
  const r = rng(hash(seed)); const t = THEMES[hash(seed + 't') % THEMES.length]
  const cx = 150 + r() * 100, cy = 230 + r() * 90, R = 62 + r() * 70
  const craters = Array.from({ length: 6 }, () => { const a = r() * 6.283, d = r() * R * 0.7; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d, 6 + r() * R * 0.22] })
  const lx = cx + (r() - 0.5) * R * 0.8, ly = cy - R * 0.92, lh = 50 + r() * 70, lean = (r() - 0.5) * 60
  const leaf = (s, d) => `M${lx} ${ly} C ${lx + d * 22 * s} ${ly - lh * 0.4}, ${lx + d * 40 * s + lean * 0.3} ${ly - lh * 0.7}, ${lx + d * 56 * s + lean} ${ly - lh} C ${lx + d * 10 * s} ${ly - lh * 0.8}, ${lx - d * 6 * s} ${ly - lh * 0.4}, ${lx} ${ly}Z`
  const arcs = Array.from({ length: 3 }, (_, i) => 40 + i * 44 + r() * 20)
  return (
    <svg className={`plate ${className}`} style={{ aspectRatio: ratio }} viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="اثر هنری نمایشی">
      <rect width="400" height="500" fill={t.bg} />
      {arcs.map((a, i) => <circle key={i} cx={cx} cy={cy} r={R + a} fill="none" stroke={t.line} strokeOpacity=".14" strokeWidth="1" />)}
      <circle cx={cx} cy={cy} r={R} fill={t.moon} />
      {craters.map(([x, y, rr], i) => <circle key={i} cx={x} cy={y} r={rr} fill={t.cr} opacity=".55" />)}
      <path d={`M${lx} ${ly + 6} L ${lx + lean * 0.12} ${ly - lh * 0.5}`} stroke={t.leaf} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={leaf(1, 1)} fill={t.leaf} /><path d={leaf(0.7, -1)} fill={t.leaf} opacity=".78" />
      <line x1="28" y1="468" x2="372" y2="468" stroke={t.line} strokeOpacity=".35" />
      {glyph && <text x="372" y="452" textAnchor="end" fontSize="22" fill={t.line} opacity=".7" fontFamily="serif">{glyph}</text>}
    </svg>
  )
}
export const kindGlyph = (k) => ({ صوت: '♫', متن: '❝', ویدئو: '▶', PDF: '§' }[k] || '✦')
