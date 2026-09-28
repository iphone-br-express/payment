# iPhone Express — 7Bank / Render

Frontend: publique o conteúdo de `frontend/` no GitHub Pages.

Render: Root Directory `server`; Build `npm install`; Start `npm start`.

Environment Variables:
- PAYBR_CLIENT_ID = live_841e2f45b561386f4cc4b4dabcdd84b0
- PAYBR_CLIENT_SECRET = coloque o secret atual do 7Bank no Render; não coloque no GitHub
- PAYBR_API_URL = https://api-7bank.squareweb.app
- ALLOWED_ORIGIN = https://iphone-br-express.github.io

O backend envia ao 7Bank somente `amount`, `description`, `payerName`, `payerDocument`, usando os headers obrigatórios. O preço é resolvido no backend pelo productId. Falha do Cash-In retorna `Produto esgotado` ao frontend.
