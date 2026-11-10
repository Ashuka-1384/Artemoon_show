import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { auth, wallet } from '@/services'

const Ctx = createContext(null)
export function SessionProvider({ children }) {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    const me = await auth.me(); setUser(me)
    setBalance(me ? await wallet.balance() : 0); setReady(true); return me
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const value = useMemo(() => ({
    user, balance, ready, refresh,
    login: async (e, p) => { await auth.login(e, p); return refresh() },
    register: async (f) => { await auth.register(f); return refresh() },
    logout: async () => { await auth.logout(); return refresh() },
  }), [user, balance, ready, refresh])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useSession = () => useContext(Ctx)
