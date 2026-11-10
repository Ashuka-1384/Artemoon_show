import { db, ApiError } from './db'
import { requireUser, currentUser, publicUser } from './auth'
import { credit, balanceOf } from './wallet'
import { CATEGORIES, CHALLENGE_WEEKS, MIN_STAKE, MAX_STAKE, WEEK } from '@/lib/constants'

const find = (id) => { const c = db.get().challenges.find((x) => x.id === id); if (!c) throw new ApiError('چالش پیدا نشد.', 'NOT_FOUND'); return c }
const user = (id) => db.get().users.find((u) => u.id === id)
const isPart = (c, uid) => c.challengerId === uid || c.opponentId === uid

/** پایان خودکار: برنده بیشترین رأی را می‌برد و کل توکن‌های میانه (۲×مبلغ) را می‌گیرد. */
function finalize(c) {
  const [a, b] = [c.challengerId, c.opponentId]; const ea = c.entries[a], eb = c.entries[b]; const pot = c.stake * 2
  c.status = 'finished'; c.finishedAt = Date.now()
  if (ea && eb && ea.votes === eb.votes) c.result = 'draw'
  else if (!ea && !eb) c.result = 'void'
  else { c.winnerId = !eb || (ea && ea.votes > eb.votes) ? a : b; c.result = ea && eb ? 'win' : 'forfeit' }
  if (c.winnerId) credit(c.winnerId, pot, 'win', `برنده‌شدن در چالش «${c.title}»`)
  else { credit(a, c.stake, 'refund', `بازگشت توکن چالش «${c.title}»`); credit(b, c.stake, 'refund', `بازگشت توکن چالش «${c.title}»`) }
}
function sync() { let changed = false; db.get().challenges.forEach((c) => { if (c.status === 'active' && c.endsAt <= Date.now()) { finalize(c); changed = true } }); changed && db.save() }

function hydrate(c) {
  const me = currentUser()
  return {
    ...c, pot: c.stake * 2, totalVotes: Object.values(c.entries).reduce((s, e) => s + e.votes, 0),
    challenger: publicUser(user(c.challengerId)), opponent: publicUser(user(c.opponentId)),
    myRole: me ? (c.challengerId === me.id ? 'challenger' : c.opponentId === me.id ? 'opponent' : null) : null,
    hasVoted: !!me && c.voterIds.includes(me.id),
  }
}

export const challenges = {
  /** status: pending | active | finished | all (عمومی: pending نمایش داده نمی‌شود) */
  async list({ status = 'all', category = '', q = '' } = {}) {
    sync(); const s = q.trim()
    return db.get().challenges
      .filter((c) => c.status === 'active' || c.status === 'finished')
      .filter((c) => (status === 'all' || c.status === status) && (!category || c.category === category) && (!s || `${c.title} ${c.theme}`.includes(s)))
      .sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0)).map(hydrate)
  },
  async get(id) {
    sync(); const c = find(id); const me = currentUser()
    if ((c.status === 'pending' || c.status === 'declined' || c.status === 'cancelled') && !(me && isPart(c, me.id))) throw new ApiError('چالش پیدا نشد.', 'NOT_FOUND')
    return hydrate(c)
  },
  async mine() {
    sync(); const me = requireUser()
    const all = db.get().challenges.filter((c) => isPart(c, me.id)).sort((a, b) => b.createdAt - a.createdAt).map(hydrate)
    return {
      incoming: all.filter((c) => c.status === 'pending' && c.opponentId === me.id),
      outgoing: all.filter((c) => c.status === 'pending' && c.challengerId === me.id),
      active: all.filter((c) => c.status === 'active'),
      finished: all.filter((c) => c.status === 'finished'),
      closed: all.filter((c) => c.status === 'declined' || c.status === 'cancelled'),
    }
  },
  async request({ opponentId, title, theme, weeks, stake }) {
    const me = requireUser(); const op = user(opponentId); stake = Number(stake); weeks = Number(weeks)
    if (!op) throw new ApiError('هنرمند پیدا نشد.', 'NOT_FOUND')
    if (op.id === me.id) throw new ApiError('نمی‌توانید با خودتان چالش بگذارید.')
    if (op.cat !== me.cat) throw new ApiError('درخواست چالش فقط بین هنرمندان هم‌حوزه ممکن است.', 'CATEGORY_MISMATCH')
    if (!CHALLENGE_WEEKS.includes(weeks)) throw new ApiError('مدت چالش باید ۱ تا ۴ هفته باشد.')
    if (!(stake >= MIN_STAKE && stake <= MAX_STAKE)) throw new ApiError(`مبلغ توکن باید بین ${MIN_STAKE} تا ${MAX_STAKE} باشد.`)
    if (!title.trim()) throw new ApiError('عنوان چالش را بنویسید.')
    if (db.get().challenges.some((c) => c.status === 'pending' && c.challengerId === me.id && c.opponentId === op.id)) throw new ApiError('برای این هنرمند درخواست در انتظار پاسخ دارید.', 'CONFLICT')
    if (balanceOf(me.id) < stake) throw new ApiError('موجودی توکن برای این مبلغ کافی نیست.', 'INSUFFICIENT_TOKENS')
    credit(me.id, -stake, 'stake', `توکن درخواست چالش «${title.trim()}»`)
    const c = { id: `c_${Date.now().toString(36)}`, title: title.trim(), theme: theme.trim(), category: me.cat, weeks, stake, status: 'pending', challengerId: me.id, opponentId: op.id, createdAt: Date.now(), startedAt: null, endsAt: null, entries: {}, voterIds: [], winnerId: null, result: null }
    db.get().challenges.push(c); db.save(); return hydrate(c)
  },
  async respond(id, accept) {
    const me = requireUser(); const c = find(id)
    if (c.status !== 'pending' || c.opponentId !== me.id) throw new ApiError('این درخواست قابل پاسخ نیست.', 'FORBIDDEN')
    if (accept) {
      if (balanceOf(me.id) < c.stake) throw new ApiError(`برای پذیرش باید ${c.stake} توکن در کیف خود داشته باشید.`, 'INSUFFICIENT_TOKENS')
      credit(me.id, -c.stake, 'stake', `توکن پذیرش چالش «${c.title}»`)
      Object.assign(c, { status: 'active', startedAt: Date.now(), endsAt: Date.now() + c.weeks * WEEK })
    } else { credit(c.challengerId, c.stake, 'refund', `رد چالش «${c.title}» — بازگشت توکن`); c.status = 'declined' }
    db.save(); return hydrate(c)
  },
  async cancel(id) {
    const me = requireUser(); const c = find(id)
    if (c.status !== 'pending' || c.challengerId !== me.id) throw new ApiError('امکان لغو وجود ندارد.', 'FORBIDDEN')
    credit(me.id, c.stake, 'refund', `لغو چالش «${c.title}» — بازگشت توکن`); c.status = 'cancelled'; db.save(); return hydrate(c)
  },
  async submitEntry(id, { title, desc, kind, fileName }) {
    sync(); const me = requireUser(); const c = find(id)
    if (!isPart(c, me.id)) throw new ApiError('فقط شرکت‌کنندگان می‌توانند اثر ثبت کنند.', 'FORBIDDEN')
    if (c.status !== 'active') throw new ApiError('این چالش فعال نیست.')
    if (c.entries[me.id]?.votes > 0) throw new ApiError('پس از ثبت رأی، اثر قابل ویرایش نیست.')
    c.entries[me.id] = { title, desc, kind, fileName: fileName || null, votes: 0, submittedAt: Date.now() }; db.save(); return hydrate(c)
  },
  async vote(id, entryUserId) {
    sync(); const me = requireUser(); const c = find(id)
    if (c.status !== 'active') throw new ApiError('رأی‌گیری این چالش بسته شده است.')
    if (isPart(c, me.id)) throw new ApiError('شرکت‌کنندگان نمی‌توانند در چالش خودشان رأی بدهند.', 'FORBIDDEN')
    if (c.voterIds.includes(me.id)) throw new ApiError('شما در این چالش رأی خود را داده‌اید.', 'CONFLICT')
    if (!c.entries[entryUserId]) throw new ApiError('اثر پیدا نشد.', 'NOT_FOUND')
    c.entries[entryUserId].votes += 1; c.voterIds.push(me.id); db.save(); return hydrate(c)
  },
  // ── ابزارهای شبیه‌ساز (فقط حالت demo؛ در بک‌اند وجود ندارند) ──
  async demo(id, action) {
    const c = find(id); const me = requireUser(); const other = c.challengerId === me.id ? c.opponentId : c.challengerId
    if (action === 'accept' && c.status === 'pending') { credit(c.opponentId, -c.stake, 'stake', 'نمایشی'); Object.assign(c, { status: 'active', startedAt: Date.now(), endsAt: Date.now() + c.weeks * WEEK }) }
    if (action === 'entry' && c.status === 'active') c.entries[other] = { title: 'اثر رقیب', desc: 'نمونه‌کاری که رقیب شبیه‌سازی‌شده ثبت کرده است.', kind: c.entries[me.id]?.kind || 'تصویر', fileName: null, votes: 0, submittedAt: Date.now() }
    if (action === 'votes' && c.status === 'active') Object.values(c.entries).forEach((e) => { e.votes += 2 + Math.floor(Math.random() * 9) })
    if (action === 'finish' && c.status === 'active') { c.endsAt = Date.now() - 1; sync() }
    db.save(); return hydrate(c)
  },
  async stats() { sync(); const d = db.get(); const act = d.challenges.filter((c) => c.status === 'active'); return { artists: d.users.length, active: act.length, finished: d.challenges.filter((c) => c.status === 'finished').length, pot: act.reduce((s, c) => s + c.stake * 2, 0), categories: CATEGORIES.length } },
}
