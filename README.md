# iPhone Express V28 — 7Bank

V28 é baseada na V27 e adiciona diagnóstico detalhado dos erros do gateway.

## Diagnóstico de depósitos
- O Render preserva o HTTP status retornado pelo 7Bank.
- O log `[7Bank deposit error]` mostra requestId, status HTTP e corpo retornado pelo gateway.
- O Client Secret nunca é impresso e o CPF é mascarado.
- Erros 400, 401, 402, 403, 404, 409, 429 e 5xx recebem códigos distintos.
- Se o gateway retornar HTTP 500 com uma mensagem como `Request failed with status code 400`, o sistema identifica o status interno 400, mas não o trata como limite de valor sem evidência.
- A mensagem original retornada pelo gateway (`providerMessage`) é enviada ao frontend para facilitar o diagnóstico.
- “Produto esgotado” não é usado para erros genéricos de API.

## Depósito
O backend envia exatamente os quatro campos documentados pelo 7Bank:
`amount`, `description`, `payerName`, `payerDocument`. O valor vem do catálogo no servidor.

## Render
Configure:
- `PAYBR_CLIENT_ID`
- `PAYBR_CLIENT_SECRET`
- `PAYBR_API_URL=https://api-7bank.squareweb.app`
- `ALLOWED_ORIGIN=https://iphone-br-express.github.io`

Nunca coloque o Client Secret no GitHub Pages.

## Teste seguro
Depois do deploy, faça uma única tentativa com um produto que falha. Abra Render → Logs e procure `[7Bank deposit error]`. Envie apenas a linha do erro para diagnóstico; nunca envie credenciais.

## Imagens
Checkout e pagamento usam `object-fit: contain` para evitar recortes.
