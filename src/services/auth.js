import { db, uid, ApiError } from './db'
import { DAY } from '@/lib/constants'

export const publicUser = (u) => { if (!u) return null; const { pass, nid, contact, ...rest } = u; return rest }
export const displayName = (u) => (u?.stage || u?.name || '')

export function currentUser() { const d = db.get(); return d.users.find((u) => u.id === d.sessionUserId) || null }
export function requireUser() { const u = currentUser(); if (!u) throw new ApiError('برای این کار باید وارد حساب خود شوید.', 'UNAUTHENTICATED'); return u }

const TITLES = { نویسندگی: 'داستان در ۱۰۰ کلمه', عکاسی: 'پرتره با نور طبیعی', نقاشی: 'رنگِ سکوت', نوازندگی: 'اتودِ نیمه‌شب', گرافیک: 'پوستر یک‌رنگ', بازیگری: 'مونولوگِ یک‌دقیقه‌ای' }

export const auth = {
  async me() { const u = currentUser(); return u ? { ...publicUser(u), contact: u.contact, email: u.email, phone: u.phone } : null },
  async register(form) {
    const d = db.get()
    const email = form.email.trim().toLowerCase()
    if (d.users.some((u) => u.email?.toLowerCase() === email)) throw new ApiError('با این ایمیل قبلاً ثبت‌نام شده است.', 'CONFLICT')
    if (form.pass.length < 6) throw new ApiError('رمز عبور باید دست‌کم ۶ نویسه باشد.')
    if (form.pass !== form.pass2) throw new ApiError('رمز عبور و تکرار آن یکسان نیست.')
    const u = {
      id: uid('u'), seed: false, name: form.name.trim(), stage: form.stage.trim(), nid: form.nid, email, phone: form.phone, pass: form.pass, // ⚠️ نمایشی؛ در بک‌اند hash می‌شود
      cat: form.cat, skills: form.skills, level: form.level, path: form.path, year: form.year, city: form.city, bio: form.bio, goals: form.goals,
      works: [form.wtitle || 'نمونه‌کار اصلی'], workMeta: { title: form.wtitle, type: form.wtype, role: form.wrole, link: form.wlink, fileName: form.fileName },
      promoted: false, rating: '—', contact: { phone: form.phone, email, telegram: '' }, createdAt: Date.now(),
    }
    d.users.push(u); d.wallets[u.id] = 0
    // دعوت‌های نمایشی از هنرمندان هم‌حوزه
    d.users.filter((s) => s.seed && s.cat === u.cat).slice(0, 2).forEach((s, i) => d.challenges.push({
      id: uid('c'), title: TITLES[u.cat] || `چالش ${u.cat}`, category: u.cat, theme: `دعوت به یک رقابت دوستانه در حوزهٔ ${u.cat}.`,
      weeks: 1 + i, stake: 3, status: 'pending', challengerId: s.id, opponentId: u.id, createdAt: Date.now() - (i + 1) * DAY, startedAt: null, endsAt: null,
      entries: {}, voterIds: [], winnerId: null, result: null,
    }))
    d.sessionUserId = u.id; db.save(); return this.me()
  },
  async login(email, pass) {
    const d = db.get(); const u = d.users.find((x) => !x.seed && x.email === email.trim().toLowerCase() && x.pass === pass)
    if (!u) throw new ApiError('ایمیل یا رمز عبور درست نیست.', 'UNAUTHENTICATED')
    d.sessionUserId = u.id; db.save(); return this.me()
  },
  async logout() { db.get().sessionUserId = null; db.save() },
  async updateProfile(patch) { const u = requireUser(); Object.assign(u, patch); db.save(); return this.me() },
}
