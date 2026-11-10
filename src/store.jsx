import { createContext, useContext, useEffect, useState } from 'react'
const Ctx = createContext()
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => load('am_user', null))
  const [tokens, setTokens] = useState(() => load('am_tokens', 0))
  const [unlocked, setUnlocked] = useState(() => load('am_unlocked', []))
  useEffect(() => { try { localStorage.setItem('am_user', JSON.stringify(user)); localStorage.setItem('am_tokens', JSON.stringify(tokens)); localStorage.setItem('am_unlocked', JSON.stringify(unlocked)) } catch {} }, [user, tokens, unlocked])
  const unlock = (id, cost) => { if (unlocked.includes(id)) return; setTokens(t => t - cost); setUnlocked(u => [...u, id]) }
  return <Ctx.Provider value={{ user, setUser, tokens, setTokens, unlocked, unlock }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
export const go = p => { location.hash = p }
