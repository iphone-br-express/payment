const API_BASE_URL="https://milho-flakes.onrender.com";
const $=id=>document.getElementById(id);
const money=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const params=new URLSearchParams(location.search);
const id=params.get('id');
const urlColor=params.get('color')||'';
let product=null;
let tx='';
let creating=false;
const orderStorageKey='iphoneExpressOrder';
const txStorageKey='iphoneExpressTransaction';
function fallbackProduct(){return (window.LOCAL_PRODUCTS||[]).find(x=>x.id===id);}
function colorVariantFor(id,color){const safe=String(color||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');return `assets/products/colors/${id}-${safe}.svg`;}
function colorPhotoFor(id,color){return (window.COLOR_PHOTOS&&window.COLOR_PHOTOS[id]&&window.COLOR_PHOTOS[id][color])||null;}
function colorDisplayFor(id,color){return colorPhotoFor(id,color)||window.FAMILY_PHOTOS?.[id]||window.REAL_PHOTOS?.[id]||colorVariantFor(id,color);}
function colorPositionFor(id,color){const o=(window.COLOR_IMAGE_ORDER&&window.COLOR_IMAGE_ORDER[id])||[];const i=o.indexOf(color);return i<0?'50%':`${Math.round((i/Math.max(1,o.length-1))*100)}%`;}
function qrSrc(value){const s=String(value||'');if(s.startsWith('base64:'))return 'data:image/png;base64,'+s.slice(7);if(/^data:image\//i.test(s)||/^https?:\/\//i.test(s))return s;return '';}
async function api(path,opt={}){const r=await fetch(API_BASE_URL+path,{...opt,headers:{'Content-Type':'application/json',...(opt.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok){const e=new Error(d.message||d.error||`HTTP ${r.status}`);e.status=r.status;e.code=d.code;e.providerMessage=d.providerMessage||'';e.providerStatus=d.providerStatus||r.status;e.nestedStatus=d.nestedStatus||null;throw e;}return d;}
function setResult(text,error=false){$("result").textContent=text;$("result").className=error?'message error':'message';}
(async()=>{try{
 const order=JSON.parse(sessionStorage.getItem('iphoneExpressOrder')||'null');
 if(!order||order.productId!==id)throw new Error('Dados do pedido não encontrados. Volte ao produto e preencha a entrega novamente.');
 product=fallbackProduct(); try{const d=await api('/api/products');product=(d.products||[]).find(x=>x.id===id)||product;}catch{}
 if(!product)throw new Error('Produto não encontrado.');
 const chosenColor=order.color||urlColor||'';
 const paymentPhoto=colorDisplayFor(id,chosenColor)||`assets/products/${product.id}-front.svg`;
 const paymentPos=colorPositionFor(id,chosenColor);
 $("summary").innerHTML=`<img class="summary-img" src="${paymentPhoto}" alt="${product.name} ${chosenColor}" style="object-fit:contain;object-position:center center" onerror="this.onerror=null;this.src='assets/products/${product.id}-front.svg'"><h2>${product.name}</h2><p>${product.storage}</p><div class="selected-color"><span>Cor escolhida</span><strong>${order.color||'Não informado'}</strong></div><div class="delivery-box"><strong>🚚 Entrega Full</strong><br>Até 7 dias úteis</div><div class="line"><span>Produto</span><strong>${money(product.price)}</strong></div><div class="line"><span>Frete</span><strong>Grátis</strong></div><div class="total"><span>Total</span><strong>${money(product.price)}</strong></div>`;
 $("hello").textContent=`Olá, ${order.name}. O valor final do pedido é:`; $("total").textContent=money(product.price);
 const fingerprint=[order.productId,order.color,order.name,order.cpf].join('|');
 const previousFingerprint=sessionStorage.getItem('iphoneExpressPaymentFingerprint')||'';
 const previousTx=sessionStorage.getItem(txStorageKey)||'';
 if(previousTx && previousFingerprint===fingerprint){
   try{
     const existing=await api('/api/transactions/check?transactionId='+encodeURIComponent(previousTx));
     tx=previousTx;
     const q=qrSrc(existing.qrcodeUrl||existing.qrCodeUrl||existing.qrCode?.url||'');
     if(q){$("qr").src=q;$("qr").classList.remove('hidden');}
     if(existing.copyPaste)$("copyPaste").value=existing.copyPaste;
     $("loading").classList.add('hidden');$("pix").classList.remove('hidden');$("statusText").textContent=`Status: ${existing.transaction?.transactionState||existing.status||'PENDENTE'}`;
     return;
   }catch{}
 }
 if(creating)return; creating=true;
 const data=await api('/api/deposit',{method:'POST',body:JSON.stringify({productId:order.productId,color:order.color,description:`Venda ${product.name} ${product.storage} - ${order.color}`,payerName:order.name,payerDocument:order.cpf})});
 tx=data.transactionId||data.id||data.transaction?.transactionId||data.transaction?.id||'';
 sessionStorage.setItem(txStorageKey,tx);
 sessionStorage.setItem('iphoneExpressPaymentFingerprint',fingerprint);
 const q=qrSrc(data.qrcodeUrl||data.qrCodeUrl||data.qrCode?.url||''); if(q){$("qr").src=q;$("qr").classList.remove('hidden');} if(data.copyPaste)$("copyPaste").value=data.copyPaste;
 $("loading").classList.add('hidden');$("pix").classList.remove('hidden');$("statusText").textContent=`Status: ${data.status||'PENDENTE'}`;
}catch(e){console.error('[PIX]',e);let text=`Não foi possível gerar o Pix: ${e.message||'erro desconhecido'}.`;if(e.providerStatus){text+=` Código do gateway: ${e.providerStatus}.`;if(e.providerMessage)text+=` Detalhe: ${e.providerMessage}`;}if(e.code)text+=` [${e.code}]`;$("loading").textContent=text;$("loading").className='message error';}})();
$("copy").addEventListener('click',async()=>{try{await navigator.clipboard.writeText($("copyPaste").value);setResult('Pix Copia e Cola copiado.');}catch{setResult('Não foi possível copiar automaticamente.',true);}});
$("check").addEventListener('click',async()=>{if(!tx)tx=sessionStorage.getItem('iphoneExpressTransaction')||'';if(!tx){setResult('Transação ainda não foi criada.',true);return;}try{const d=await api('/api/transactions/check?transactionId='+encodeURIComponent(tx));const st=d.transaction?.transactionState||d.status||'ATUALIZADO';$("statusText").textContent=`Status: ${st}`;setResult('Status atualizado: '+st);}catch(e){setResult(e.message,true);}});
