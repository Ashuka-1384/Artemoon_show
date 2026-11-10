// نقطهٔ ورود سرویس‌ها. هر export معادل یک ماژول NestJS است (AuthModule, ArtistsModule, WalletModule, ChallengesModule).
export { auth } from './auth'
export { artists } from './artists'
export { wallet } from './wallet'
export { challenges } from './challenges'
export { db, ApiError } from './db'
