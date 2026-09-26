const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = (process.env.PAYBR_API_URL || "https://api-pluspix.squareweb.app").replace(/\/$/, "");
const CLIENT_ID = process.env.PAYBR_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYBR_CLIENT_SECRET;
const ALLOWED_ORIGIN = (process.env.ALLOWED_ORIGIN || "https://iphone-br-express.github.io").replace(/\/$/, "");


const COLOR_OPTIONS = {
  "iPhone X": ["Cinza-espacial", "Prateado"],
  "iPhone XR": ["Preto", "Branco", "Azul", "Amarelo", "Coral", "(PRODUCT)RED"],
  "iPhone XS": ["Cinza-espacial", "Prateado", "Dourado"],
  "iPhone XS Max": ["Cinza-espacial", "Prateado", "Dourado"],
  "iPhone 11": ["Preto", "Branco", "Verde", "Amarelo", "Roxo", "(PRODUCT)RED"],
  "iPhone 11 Pro": ["Verde-meia-noite", "Prateado", "Cinza-espacial", "Dourado"],
  "iPhone 11 Pro Max": ["Verde-meia-noite", "Prateado", "Cinza-espacial", "Dourado"],
  "iPhone 12": ["Preto", "Branco", "Azul", "Verde", "Roxo", "(PRODUCT)RED"],
  "iPhone 12 mini": ["Preto", "Branco", "Azul", "Verde", "Roxo", "(PRODUCT)RED"],
  "iPhone 12 Pro": ["Grafite", "Prateado", "Dourado", "Azul-pacífico"],
  "iPhone 12 Pro Max": ["Grafite", "Prateado", "Dourado", "Azul-pacífico"],
  "iPhone 13": ["Meia-noite", "Estelar", "Azul", "Rosa", "Verde", "(PRODUCT)RED"],
  "iPhone 13 mini": ["Meia-noite", "Estelar", "Azul", "Rosa", "Verde", "(PRODUCT)RED"],
  "iPhone 13 Pro": ["Grafite", "Dourado", "Prateado", "Azul-serra", "Verde-alpino"],
  "iPhone 13 Pro Max": ["Grafite", "Dourado", "Prateado", "Azul-serra", "Verde-alpino"],
  "iPhone 14": ["Meia-noite", "Estelar", "Azul", "Roxo", "(PRODUCT)RED"],
  "iPhone 14 Plus": ["Meia-noite", "Estelar", "Azul", "Roxo", "(PRODUCT)RED"],
  "iPhone 14 Pro": ["Preto-espacial", "Prateado", "Dourado", "Roxo-profundo"],
  "iPhone 14 Pro Max": ["Preto-espacial", "Prateado", "Dourado", "Roxo-profundo"],
  "iPhone 15": ["Preto", "Azul", "Verde", "Amarelo", "Rosa"],
  "iPhone 15 Plus": ["Preto", "Azul", "Verde", "Amarelo", "Rosa"],
  "iPhone 15 Pro": ["Titânio preto", "Titânio branco", "Titânio azul", "Titânio natural"],
  "iPhone 15 Pro Max": ["Titânio preto", "Titânio branco", "Titânio azul", "Titânio natural"],
  "iPhone 16": ["Preto", "Branco", "Rosa", "Verde-azulado", "Ultramarino"],
  "iPhone 16 Plus": ["Preto", "Branco", "Rosa", "Verde-azulado", "Ultramarino"],
  "iPhone 16 Pro": ["Titânio preto", "Titânio branco", "Titânio natural", "Titânio deserto"],
  "iPhone 16 Pro Max": ["Titânio preto", "Titânio branco", "Titânio natural", "Titânio deserto"],
  "iPhone 17e": ["Preto", "Branco"],
  "iPhone 17": ["Preto", "Branco", "Azul", "Verde", "Rosa"],
  "iPhone Air": ["Preto", "Branco", "Azul", "Dourado"],
  "iPhone 17 Pro": ["Preto", "Prateado", "Azul", "Dourado"],
  "iPhone 17 Pro Max": ["Preto", "Prateado", "Azul", "Dourado"],
  "iPhone 18 Pro": ["Preto", "Prateado", "Azul", "Dourado"],
  "iPhone 18 Pro Max": ["Preto", "Prateado", "Azul", "Dourado"]
};
function colorsFor(product){return COLOR_OPTIONS[product.name] || ["Preto","Branco","Azul","Dourado"];}

const PRODUCTS = [
  {
    "id": "iphone-x-64",
    "name": "iPhone X",
    "storage": "64 GB",
    "referencePrice": 849,
    "discount": 30,
    "price": 594.3
  },
  {
    "id": "iphone-xr-64",
    "name": "iPhone XR",
    "storage": "64 GB",
    "referencePrice": 879,
    "discount": 30,
    "price": 615.3
  },
  {
    "id": "iphone-xs-64",
    "name": "iPhone XS",
    "storage": "64 GB",
    "referencePrice": 979,
    "discount": 30,
    "price": 685.3
  },
  {
    "id": "iphone-xs-max-64",
    "name": "iPhone XS Max",
    "storage": "64 GB",
    "referencePrice": 1059,
    "discount": 30,
    "price": 741.3
  },
  {
    "id": "iphone-11-64",
    "name": "iPhone 11",
    "storage": "64 GB",
    "referencePrice": 1150,
    "discount": 30,
    "price": 805.0
  },
  {
    "id": "iphone-11-pro-64",
    "name": "iPhone 11 Pro",
    "storage": "64 GB",
    "referencePrice": 1439,
    "discount": 30,
    "price": 1007.3
  },
  {
    "id": "iphone-11-pro-max-64",
    "name": "iPhone 11 Pro Max",
    "storage": "64 GB",
    "referencePrice": 1700,
    "discount": 30,
    "price": 1190.0
  },
  {
    "id": "iphone-12-64",
    "name": "iPhone 12",
    "storage": "64 GB",
    "referencePrice": 2049,
    "discount": 30,
    "price": 1434.3
  },
  {
    "id": "iphone-12-mini-64",
    "name": "iPhone 12 mini",
    "storage": "64 GB",
    "referencePrice": 1864,
    "discount": 30,
    "price": 1304.8
  },
  {
    "id": "iphone-12-pro-128",
    "name": "iPhone 12 Pro",
    "storage": "128 GB",
    "referencePrice": 2200,
    "discount": 30,
    "price": 1540.0
  },
  {
    "id": "iphone-12-pro-max-128",
    "name": "iPhone 12 Pro Max",
    "storage": "128 GB",
    "referencePrice": 2570,
    "discount": 30,
    "price": 1799.0
  },
  {
    "id": "iphone-13-128",
    "name": "iPhone 13",
    "storage": "128 GB",
    "referencePrice": 2616,
    "discount": 30,
    "price": 1831.2
  },
  {
    "id": "iphone-13-mini-128",
    "name": "iPhone 13 mini",
    "storage": "128 GB",
    "referencePrice": 1999,
    "discount": 30,
    "price": 1399.3
  },
  {
    "id": "iphone-13-pro-128",
    "name": "iPhone 13 Pro",
    "storage": "128 GB",
    "referencePrice": 2801,
    "discount": 30,
    "price": 1960.7
  },
  {
    "id": "iphone-13-pro-max-128",
    "name": "iPhone 13 Pro Max",
    "storage": "128 GB",
    "referencePrice": 3299,
    "discount": 30,
    "price": 2309.3
  },
  {
    "id": "iphone-14-128",
    "name": "iPhone 14",
    "storage": "128 GB",
    "referencePrice": 3299,
    "discount": 30,
    "price": 2309.3
  },
  {
    "id": "iphone-14-plus-128",
    "name": "iPhone 14 Plus",
    "storage": "128 GB",
    "referencePrice": 3399,
    "discount": 30,
    "price": 2379.3
  },
  {
    "id": "iphone-14-pro-128",
    "name": "iPhone 14 Pro",
    "storage": "128 GB",
    "referencePrice": 3599,
    "discount": 30,
    "price": 2519.3
  },
  {
    "id": "iphone-14-pro-max-128",
    "name": "iPhone 14 Pro Max",
    "storage": "128 GB",
    "referencePrice": 5606,
    "discount": 30,
    "price": 3924.2
  },
  {
    "id": "iphone-15-128",
    "name": "iPhone 15",
    "storage": "128 GB",
    "referencePrice": 4299,
    "discount": 30,
    "price": 3009.3
  },
  {
    "id": "iphone-15-plus-128",
    "name": "iPhone 15 Plus",
    "storage": "128 GB",
    "referencePrice": 3798,
    "discount": 30,
    "price": 2658.6
  },
  {
    "id": "iphone-15-pro-128",
    "name": "iPhone 15 Pro",
    "storage": "128 GB",
    "referencePrice": 4628,
    "discount": 30,
    "price": 3239.6
  },
  {
    "id": "iphone-15-pro-max-256",
    "name": "iPhone 15 Pro Max",
    "storage": "256 GB",
    "referencePrice": 5999,
    "discount": 30,
    "price": 4199.3
  },
  {
    "id": "iphone-16-128",
    "name": "iPhone 16",
    "storage": "128 GB",
    "referencePrice": 4499,
    "discount": 30,
    "price": 3149.3
  },
  {
    "id": "iphone-16-plus-128",
    "name": "iPhone 16 Plus",
    "storage": "128 GB",
    "referencePrice": 6349,
    "discount": 30,
    "price": 4444.3
  },
  {
    "id": "iphone-16-pro-128",
    "name": "iPhone 16 Pro",
    "storage": "128 GB",
    "referencePrice": 6799,
    "discount": 30,
    "price": 4759.3
  },
  {
    "id": "iphone-16-pro-max-256",
    "name": "iPhone 16 Pro Max",
    "storage": "256 GB",
    "referencePrice": 7999,
    "discount": 30,
    "price": 5599.3
  },
  {
    "id": "iphone-17e-256",
    "name": "iPhone 17e",
    "storage": "256 GB",
    "referencePrice": 4229,
    "discount": 30,
    "price": 2960.3
  },
  {
    "id": "iphone-17e-512",
    "name": "iPhone 17e",
    "storage": "512 GB",
    "referencePrice": 5099,
    "discount": 30,
    "price": 3569.3
  },
  {
    "id": "iphone-17-256",
    "name": "iPhone 17",
    "storage": "256 GB",
    "referencePrice": 5593,
    "discount": 30,
    "price": 3915.1
  },
  {
    "id": "iphone-17-512",
    "name": "iPhone 17",
    "storage": "512 GB",
    "referencePrice": 6290,
    "discount": 30,
    "price": 4403.0
  },
  {
    "id": "iphone-air-256",
    "name": "iPhone Air",
    "storage": "256 GB",
    "referencePrice": 6839,
    "discount": 30,
    "price": 4787.3
  },
  {
    "id": "iphone-air-512",
    "name": "iPhone Air",
    "storage": "512 GB",
    "referencePrice": 7019,
    "discount": 30,
    "price": 4913.3
  },
  {
    "id": "iphone-air-1tb",
    "name": "iPhone Air",
    "storage": "1 TB",
    "referencePrice": 7559,
    "discount": 30,
    "price": 5291.3
  },
  {
    "id": "iphone-17-pro-256",
    "name": "iPhone 17 Pro",
    "storage": "256 GB",
    "referencePrice": 8699,
    "discount": 30,
    "price": 6089.3
  },
  {
    "id": "iphone-17-pro-max-256",
    "name": "iPhone 17 Pro Max",
    "storage": "256 GB",
    "referencePrice": 8813,
    "discount": 30,
    "price": 6169.1
  },
  {
    "id": "iphone-18-pro-256",
    "name": "iPhone 18 Pro",
    "storage": "256 GB",
    "referencePrice": 10799,
    "discount": 30,
    "price": 7559.3
  },
  {
    "id": "iphone-18-pro-max-256",
    "name": "iPhone 18 Pro Max",
    "storage": "256 GB",
    "referencePrice": 11699,
    "discount": 30,
    "price": 8189.3
  }
];

app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

function authHeaders() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Credenciais do PlusPix não configuradas no servidor.");
  }
  return {
    "Content-Type": "application/json",
    "x-client-id": CLIENT_ID,
    "x-client-secret": CLIENT_SECRET
  };
}

async function pluspix(path, options = {}) {
  const response = await fetch(API_URL + path, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });

  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; }
  catch { data = { raw: text }; }

  if (!response.ok) {
    const e = new Error(data.message || data.error || `PlusPix HTTP ${response.status}`);
    e.status = response.status;
    throw e;
  }

  return data;
}

function handleError(res, error) {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Erro interno."
  });
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "iphone-express-backend" });
});

// Catálogo público: o preço mostrado e o preço aceito no checkout vêm daqui.
app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    discount: 30,
    products: PRODUCTS.map(p => ({ ...p, colors: colorsFor(p) }))
  });
});

// O servidor escolhe o preço pelo productId.
// O valor enviado pelo navegador é ignorado.
app.post("/api/deposit", async (req, res) => {
  try {
    const { productId, payerName, payerDocument, email, phone, shipping, color } = req.body;

    const product = PRODUCTS.find((item) => item.id === String(productId));
    if (!product) {
      return res.status(400).json({ success: false, message: "Produto inválido." });
    }

    if (!payerName || !payerDocument || !email) {
      return res.status(400).json({
        success: false,
        message: "Nome, e-mail e CPF são obrigatórios."
      });
    }

    const cleanDocument = String(payerDocument).replace(/\D/g, "");
    if (cleanDocument.length !== 11) {
      return res.status(400).json({
        success: false,
        message: "CPF inválido."
      });
    }

    const availableColors = colorsFor(product);
    const selectedColor = String(color || "").trim();
    if (!selectedColor || !availableColors.includes(selectedColor)) {
      return res.status(400).json({ success: false, message: "Selecione uma cor disponível para este aparelho." });
    }

    const description = `Compra - ${product.name} ${product.storage} - Cor: ${selectedColor}`;

    const data = await pluspix("/api/v1/deposit", {
      method: "POST",
      body: JSON.stringify({
        amount: Number(product.price.toFixed(2)),
        description,
        payerName: String(payerName).trim(),
        payerDocument: cleanDocument
      })
    });

    res.json({
      ...data,
      storeProduct: { ...product, colors: availableColors, selectedColor },
      chargedAmount: Number(product.price.toFixed(2)),
      customer: { name: String(payerName).trim(), email: String(email).trim(), phone: phone || "", color: selectedColor, shipping: shipping || {} }
    });
  } catch (e) {
    handleError(res, e);
  }
});

app.get("/api/transactions/check", async (req, res) => {
  try {
    const id = req.query.transactionId;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "transactionId é obrigatório."
      });
    }

    res.json(await pluspix(
      "/api/transactions/check?transactionId=" + encodeURIComponent(id)
    ));
  } catch (e) {
    handleError(res, e);
  }
});

app.get("/api/balance", async (req, res) => {
  try {
    res.json(await pluspix("/api/v1/balance"));
  } catch (e) {
    handleError(res, e);
  }
});

app.post("/api/withdraw", async (req, res) => {
  try {
    const { amount, pixKey, pixKeyType, description } = req.body;
    const types = ["CPF", "CNPJ", "EMAIL", "PHONE", "EVP"];

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Valor inválido." });
    }
    if (!pixKey || !pixKeyType) {
      return res.status(400).json({
        success: false,
        message: "Chave PIX e tipo são obrigatórios."
      });
    }
    if (!types.includes(String(pixKeyType).toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Tipo de chave PIX inválido."
      });
    }

    res.json(await pluspix("/api/v1/withdraw", {
      method: "POST",
      body: JSON.stringify({
        amount: Number(amount),
        pixKey: String(pixKey).trim(),
        pixKeyType: String(pixKeyType).toUpperCase(),
        description: description || "Transferência PIX"
      })
    }));
  } catch (e) {
    handleError(res, e);
  }
});

app.listen(PORT, () => {
  console.log(`iPhone Express backend rodando na porta ${PORT}`);
});
