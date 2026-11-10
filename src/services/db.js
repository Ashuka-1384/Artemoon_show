// ─────────────────────────────────────────────────────────────
// پایگاه دادهٔ نمایشی (localStorage). در فاز بک‌اند، کل این فایل حذف می‌شود و
// سرویس‌های هم‌نام به API نِست‌جی‌اس (NestJS) وصل می‌شوند؛ قراردادها در services/README.md.
// ─────────────────────────────────────────────────────────────
import { storage } from '@/lib/storage'
import { DAY, WEEK } from '@/lib/constants'

const KEY = 'artemoon.db.v2'
let cache = null
export const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 9)}`
export class ApiError extends Error { constructor(message, code = 'BAD_REQUEST') { super(message); this.code = code } }

const A = [
  ['سارا کیانی', 'نقاشی', 'تهران', 'هنرمند حرفه‌ای', 'رنگ‌روغن، پرتره، اکریلیک', 1396],
  ['آرین مهرابی', 'عکاسی', 'شیراز', 'هنرمند حرفه‌ای', 'پرتره، مستند، استودیویی', 1397],
  ['نیلوفر رضایی', 'طراحی لباس', 'اصفهان', 'مدرس / متخصص', 'لباس مجلسی، پارچهٔ سنتی', 1395],
  ['پویا صادقی', 'آهنگسازی', 'تهران', 'هنرمند حرفه‌ای', 'موسیقی فیلم، الکترونیک', 1398],
  ['مهسا احمدی', 'گرافیک', 'تبریز', 'هنرمند نوپا', 'هویت بصری، پوستر', 1400],
  ['کیان فرهادی', 'فیلمبرداری و تدوین', 'مشهد', 'هنرمند حرفه‌ای', 'تیزر، مستند، رنگ‌بندی', 1396],
  ['دلارام نوری', 'بازیگری', 'تهران', 'هنرمند حرفه‌ای', 'تئاتر، سینما', 1394],
  ['رها سلطانی', 'صنایع دستی', 'یزد', 'مدرس / متخصص', 'سفال، خاتم', 1393],
  ['امیر جلالی', 'نوازندگی', 'رشت', 'هنرمند نوپا', 'پیانو، سنتور', 1399],
  ['مریم فرهمند', 'نویسندگی', 'تهران', 'هنرمند حرفه‌ای', 'داستان کوتاه، مینیمال', 1397],
  ['بردیا شفیعی', 'نویسندگی', 'اصفهان', 'هنرمند نوپا', 'رمان، نقد ادبی', 1399],
  ['ترانه وحیدی', 'عکاسی', 'تهران', 'هنرمند حرفه‌ای', 'خیابانی، معماری', 1396],
  ['هومن کاظمی', 'نقاشی', 'شیراز', 'هنرمند نوپا', 'آبرنگ، منظره', 1400],
  ['ساناز بهرامی', 'نوازندگی', 'تهران', 'مدرس / متخصص', 'ویولن، کمانچه', 1394],
  ['سینا امیری', 'گرافیک', 'مشهد', 'هنرمند حرفه‌ای', 'تایپوگرافی، تصویرسازی', 1398],
  ['الناز حقیقی', 'بازیگری', 'شیراز', 'هنرمند نوپا', 'تئاتر خیابانی', 1399],
]
const seedUsers = () => A.map(([name, cat, city, level, skills, year], i) => ({
  id: 'a' + (i + 1), seed: true, name, stage: '', cat, city, level, skills, year,
  path: 'دانشگاهی + تجربی', goals: ['معرفی و توسعه برند شخصی', 'شرکت در ایونت‌ها و جشنواره‌ها'], promoted: i < 5,
  rating: (4 + ((i * 3) % 10) / 10).toFixed(1),
  bio: `${name} هنرمند فعال در حوزهٔ ${cat} از ${city} است. به‌دنبال همکاری‌های حرفه‌ای، تیم‌سازی و پروژه‌های تازه می‌گردد و در چالش‌های آرتمون هم حضور دارد.`,
  works: [`${cat}؛ مجموعهٔ ۱`, `${cat}؛ مجموعهٔ ۲`, `${cat}؛ مجموعهٔ ۳`],
  contact: { phone: `۰۹۱۲ ${100 + i * 37} ${1000 + i * 91}`, email: `artist${i + 1}@artemoon.ir`, telegram: `@artist_${i + 1}` },
  createdAt: Date.now() - (200 - i * 9) * DAY,
}))

const E = (title, desc, kind, votes, at) => ({ title, desc, kind, votes, submittedAt: at, fileName: null })
function seedChallenges() {
  const n = Date.now()
  const mk = (id, ca, op, o) => ({ id: 'c' + id, challengerId: 'a' + ca, opponentId: 'a' + op, voterIds: [], winnerId: null, result: null, createdAt: o.startedAt - DAY, ...o, endsAt: o.startedAt + o.weeks * WEEK })
  return [
    mk(1, 10, 11, { title: 'روایت یک پنجره', category: 'نویسندگی', theme: 'یک داستان کوتاه دربارهٔ لحظه‌ای که مسیر زندگی تغییر می‌کند.', weeks: 2, stake: 5, status: 'active', startedAt: n - 9 * DAY,
      entries: { a10: E('پشت شیشهٔ باران', 'داستان کوتاه؛ ۸۰۰ کلمه', 'متن', 42, n - 4 * DAY), a11: E('آخرین چراغ خانه', 'روایتی کوتاه از یک شب بارانی', 'متن', 36, n - 3 * DAY) } }),
    mk(2, 2, 12, { title: 'نور و سکوت', category: 'عکاسی', theme: 'با یک فریم، سکوتِ یک فضای شهری را ثبت کنید.', weeks: 1, stake: 3, status: 'active', startedAt: n - 5 * DAY,
      entries: { a2: E('میان رفت‌وآمد', 'ثبت یک لحظه در شهر', 'تصویر', 31, n - 2 * DAY), a12: E('ساعت خلوت', 'عکاسی خیابانی با نور طبیعی', 'تصویر', 28, n - 2 * DAY) } }),
    mk(3, 9, 14, { title: 'ریتمِ شهر', category: 'نوازندگی', theme: 'یک اجرای کوتاه با الهام از صداهای شهر.', weeks: 3, stake: 8, status: 'active', startedAt: n - 20 * DAY,
      entries: { a9: E('ایستگاه آخر', 'بداهه‌نوازی کوتاه', 'صوت', 47, n - 3 * DAY), a14: E('ساعت شلوغی', 'اتود ریتمیک ۹۰ ثانیه‌ای', 'صوت', 51, n - 2 * DAY) } }),
    mk(4, 1, 13, { title: 'رنگِ خاطره', category: 'نقاشی', theme: 'خاطره‌ای را بدون استفاده از چهره به تصویر بکشید.', weeks: 4, stake: 10, status: 'active', startedAt: n - 6 * DAY,
      entries: { a1: E('اتاق آبی', 'رنگ‌روغن روی بوم', 'تصویر', 6, n - DAY) } }),
    mk(5, 5, 15, { title: 'پوستری برای ماه', category: 'گرافیک', theme: 'یک پوستر برای نمایشگاهی دربارهٔ ماه.', weeks: 2, stake: 6, status: 'finished', startedAt: n - 24 * DAY, winnerId: 'a5', result: 'win',
      entries: { a5: E('هلالِ بی‌نام', 'تایپوگرافی و رنگ‌های سرد', 'تصویر', 88, n - 18 * DAY), a15: E('نیمه‌شب', 'تصویرسازی دیجیتال', 'تصویر', 71, n - 17 * DAY) } }),
    mk(6, 11, 10, { title: 'داستان در ۱۰۰ کلمه', category: 'نویسندگی', theme: 'یک داستان کامل در صد کلمه.', weeks: 1, stake: 4, status: 'finished', startedAt: n - 30 * DAY, winnerId: 'a11', result: 'win',
      entries: { a11: E('پله‌ها', 'مینی‌مال', 'متن', 64, n - 26 * DAY), a10: E('کلید', 'مینی‌مال', 'متن', 60, n - 26 * DAY) } }),
    mk(7, 16, 7, { title: 'یک مونولوگ، یک نگاه', category: 'بازیگری', theme: 'مونولوگی کوتاه با تمرکز بر نگاه.', weeks: 3, stake: 7, status: 'finished', startedAt: n - 52 * DAY, winnerId: 'a16', result: 'win',
      entries: { a16: E('پشت پرده', 'اجرای تک‌نفره', 'ویدئو', 57, n - 40 * DAY), a7: E('تماشاگر آخر', 'اجرای تک‌نفره', 'ویدئو', 49, n - 39 * DAY) } }),
  ]
}

function seed() {
  const users = seedUsers()
  const wallets = Object.fromEntries(users.map((u) => [u.id, 50]))
  return { v: 2, users, wallets, unlocks: [], txs: [], challenges: seedChallenges(), sessionUserId: null }
}

export const db = {
  get() { if (!cache) cache = storage.get(KEY) || seed(); return cache },
  save() { storage.set(KEY, cache) },
  reset() { cache = seed(); storage.set(KEY, cache) },
}
