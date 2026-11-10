const FA = '۰۱۲۳۴۵۶۷۸۹'
export const faNum = (n) => String(n).replace(/\d/g, (d) => FA[d])
export const faMoney = (n) => faNum(Number(n).toLocaleString('en-US').replace(/,/g, '٬'))
const dateFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric' })
export const fmtDate = (ts) => dateFmt.format(new Date(ts))
export const fmtMonthYear = (ts = Date.now()) =>
  new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long' }).format(new Date(ts))
export function timeLeft(ts, now = Date.now()) {
  const ms = ts - now
  if (ms <= 0) return 'پایان‌یافته'
  const d = Math.floor(ms / 86400000), h = Math.floor((ms % 86400000) / 3600000), m = Math.floor((ms % 3600000) / 60000)
  if (d > 0) return `${faNum(d)} روز${h ? ' و ' + faNum(h) + ' ساعت' : ''}`
  if (h > 0) return `${faNum(h)} ساعت${m ? ' و ' + faNum(m) + ' دقیقه' : ''}`
  return `${faNum(Math.max(m, 1))} دقیقه`
}
export const initial = (name = '') => name.trim()[0] || 'ه'
