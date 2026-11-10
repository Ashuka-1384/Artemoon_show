import { useEffect } from 'react'
import { Link } from '@/lib/navigation'

/** دکمه/لینک — variant: solid | outline | text | light */
export function Button({ href, variant = 'solid', size = '', arrow, className = '', children, ...p }) {
  const cls = `btn btn--${variant} ${size ? 'btn--' + size : ''} ${className}`
  const inner = <><span>{children}</span>{arrow && <i className="btn__arrow" aria-hidden>←</i>}</>
  return href ? <Link href={href} className={cls} {...p}>{inner}</Link> : <button className={cls} {...p}>{inner}</button>
}
export const Eyebrow = ({ children, light }) => <span className={`eyebrow ${light ? 'eyebrow--light' : ''}`}>{children}</span>
export function SectionHead({ no, eyebrow, title, aside, id }) {
  return (
    <header className="section-head" id={id}>
      <div className="section-head__no">{no}</div>
      <div className="section-head__body"><Eyebrow>{eyebrow}</Eyebrow><h2 className="display-md">{title}</h2></div>
      {aside && <div className="section-head__aside">{aside}</div>}
    </header>
  )
}
export const Tag = ({ children, tone }) => <span className={`tag ${tone ? 'tag--' + tone : ''}`}>{children}</span>
export function Field({ label, hint, children, className = '' }) {
  return <label className={`field ${className}`}><span className="field__label">{label}</span>{children}{hint && <small className="field__hint">{hint}</small>}</label>
}
export function Modal({ open, onClose, title, eyebrow, children }) {
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal" onMouseDown={onClose}>
      <div className="modal__panel" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="بستن">×</button>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}{title && <h3 className="display-sm">{title}</h3>}{children}
      </div>
    </div>
  )
}
export const Empty = ({ title, text, action }) => <div className="empty"><span className="empty__mark" aria-hidden>◌</span><h3>{title}</h3>{text && <p>{text}</p>}{action}</div>
export const Loading = () => <div className="loading" aria-busy="true"><i /><i /><i /></div>
export const PageHead = ({ eyebrow, title, lead, aside }) => (
  <header className="page-head container">
    <div><Eyebrow>{eyebrow}</Eyebrow><h1 className="display-lg">{title}</h1>{lead && <p className="lead">{lead}</p>}</div>
    {aside && <div className="page-head__aside">{aside}</div>}
  </header>
)
export const Monogram = ({ name, size = 'md' }) => <span className={`mono-av mono-av--${size}`} aria-hidden>{(name || 'ه').trim()[0]}</span>
