// لایهٔ انتزاعی ناوبری — تنها فایلی که به react-router وابسته است.
// مهاجرت به Next.js: Link → next/link ، useRouter → next/navigation ،
// usePathname / useParams → next/navigation. بقیهٔ پروژه دست‌نخورده می‌ماند.
import { Link as RRLink, NavLink as RRNavLink, useNavigate, useLocation, useParams as useRRParams, useSearchParams } from 'react-router-dom'

export const Link = ({ href, ...props }) => <RRLink to={href} {...props} />
export const NavLink = ({ href, end, ...props }) => <RRNavLink to={href} end={end} {...props} />
export const useRouter = () => { const n = useNavigate(); return { push: (p) => n(p), replace: (p) => n(p, { replace: true }), back: () => n(-1) } }
export const usePathname = () => useLocation().pathname
export const useParams = useRRParams
export const useQuery = () => useSearchParams()
