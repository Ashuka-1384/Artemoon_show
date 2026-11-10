// تنها نقطهٔ دسترسی به localStorage (در Next.js باید فقط سمت کلاینت صدا زده شود).
const has = () => typeof window !== 'undefined' && !!window.localStorage
export const storage = {
  get(key, fallback = null) { try { return has() ? JSON.parse(localStorage.getItem(key)) ?? fallback : fallback } catch { return fallback } },
  set(key, value) { try { has() && localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota */ } },
  remove(key) { try { has() && localStorage.removeItem(key) } catch { /* noop */ } },
}
