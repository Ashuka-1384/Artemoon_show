import { createContext, useCallback, useContext, useState } from 'react'
const Ctx = createContext(() => {})
export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((text, tone = 'ok') => {
    const id = Math.random()
    setItems((i) => [...i, { id, text, tone }]); setTimeout(() => setItems((i) => i.filter((x) => x.id !== id)), 4200)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">{items.map((t) => <div key={t.id} className={`toast toast--${t.tone}`}>{t.text}</div>)}</div>
    </Ctx.Provider>
  )
}
export const useToast = () => useContext(Ctx)
