import { db, uid, ApiError } from './db'
import { requireUser } from './auth'
import { CONTACT_COST, PACKS } from '@/lib/constants'

export const credit = (userId, amount, type, note) => {
  const d = db.get(); d.wallets[userId] = (d.wallets[userId] || 0) + amount
  d.txs.unshift({ id: uid('t'), userId, type, amount, note, at: Date.now() })
}
export const balanceOf = (userId) => db.get().wallets[userId] || 0

export const wallet = {
  async balance() { const u = requireUser(); return balanceOf(u.id) },
  async transactions() { const u = requireUser(); return db.get().txs.filter((t) => t.userId === u.id) },
  async buyPack(packId) {
    const u = requireUser(); const p = PACKS.find((x) => x.id === packId); if (!p) throw new ApiError('بستهٔ نامعتبر.')
    credit(u.id, p.tokens, 'purchase', `خرید بستهٔ ${p.tokens} توکنی (نمایشی)`); db.save(); return balanceOf(u.id)
  },
  async unlockContact(artistId) {
    const u = requireUser(); const d = db.get(); const a = d.users.find((x) => x.id === artistId)
    if (!a) throw new ApiError('هنرمند پیدا نشد.', 'NOT_FOUND'); if (a.id === u.id) return a.contact
    if (d.unlocks.some((x) => x.userId === u.id && x.artistId === artistId)) return a.contact
    if (balanceOf(u.id) < CONTACT_COST) throw new ApiError('موجودی توکن کافی نیست.', 'INSUFFICIENT_TOKENS')
    credit(u.id, -CONTACT_COST, 'unlock', `دسترسی به اطلاعات تماس ${a.stage || a.name}`)
    d.unlocks.push({ userId: u.id, artistId, at: Date.now() }); db.save(); return a.contact
  },
}
