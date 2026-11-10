import { db, ApiError } from './db'
import { currentUser, publicUser } from './auth'

const withMeta = (u) => ({ ...publicUser(u), unlocked: isUnlocked(u.id) })
export function isUnlocked(artistId) { const me = currentUser(); return !!me && (me.id === artistId || db.get().unlocks.some((x) => x.userId === me.id && x.artistId === artistId)) }

export const artists = {
  async list({ q = '', cat = '', city = '' } = {}) {
    const s = q.trim()
    return db.get().users
      .filter((u) => (!cat || u.cat === cat) && (!city || u.city === city) && (!s || `${u.name} ${u.stage} ${u.skills}`.includes(s)))
      .sort((a, b) => Number(b.promoted) - Number(a.promoted) || b.createdAt - a.createdAt).map(withMeta)
  },
  async get(id) { const u = db.get().users.find((x) => x.id === id); if (!u) throw new ApiError('هنرمند پیدا نشد.', 'NOT_FOUND'); return withMeta(u) },
  async cities() { return [...new Set(db.get().users.map((u) => u.city).filter(Boolean))] },
  /** فقط اگر کاربر قبلاً توکن خرج کرده باشد (یا پروفایل خودش باشد) */
  async contact(id) {
    if (!isUnlocked(id)) throw new ApiError('برای دیدن اطلاعات تماس باید توکن خرج کنید.', 'FORBIDDEN')
    return db.get().users.find((x) => x.id === id).contact
  },
}
