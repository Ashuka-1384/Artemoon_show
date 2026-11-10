# قراردادهای سرویس ↔ بک‌اند (NestJS)

هر تابع این پوشه معادل یک endpoint است؛ هنگام اتصال بک‌اند فقط بدنهٔ توابع به `fetch` تبدیل می‌شود.

| سرویس | تابع | Endpoint پیشنهادی |
|---|---|---|
| auth | register / login / logout / me | `POST /auth/register` · `POST /auth/login` · `POST /auth/logout` · `GET /auth/me` |
| artists | list / get / contact | `GET /artists` · `GET /artists/:id` · `GET /artists/:id/contact` (۴۰۳ بدون پرداخت) |
| wallet | balance / buyPack / unlockContact / transactions | `GET /wallet` · `POST /wallet/purchase` · `POST /wallet/unlock/:artistId` · `GET /wallet/transactions` |
| challenges | list / get / mine / request / respond / cancel / submitEntry / vote | `GET /challenges` · `GET /challenges/:id` · `GET /challenges/mine` · `POST /challenges` · `POST /challenges/:id/respond` · `POST /challenges/:id/cancel` · `PUT /challenges/:id/entry` · `POST /challenges/:id/vote` |

قواعد کسب‌وکار (باید در بک‌اند، داخل تراکنش دیتابیس اجرا شوند): قفل (escrow) توکن هر دو طرف، یک رأی برای هر کاربر در هر چالش، ممنوعیت رأی شرکت‌کنندگان، تعیین برنده با کران‌جاب (Cron) در `endsAt`، تساوی = بازگشت توکن، عدم ثبت اثر یکی از طرفین = برد دیگری.
