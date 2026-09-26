const $=id=>document.getElementById(id);
const money=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const params=new URLSearchParams(location.search); const id=params.get('id') || params.get('produto') || params.get('product'); const requestedColor=params.get('color')||'';
function fallbackProduct(){return (window.LOCAL_PRODUCTS||[]).find(x=>String(x.id)===String(id));}
function showFatal(message){const detail=document.getElementById('detail'); if(detail) detail.innerHTML=`<div class="empty"><h2>Não foi possível carregar o produto.</h2><p>${esc(message)}</p><a class="buy" href="index.html">Voltar à loja</a></div>`;}
function productImage(p){return (window.REAL_PHOTOS&&window.REAL_PHOTOS[p.id])||`assets/products/${p.id}-front.svg`;}
function gallery(p){return (window.REAL_GALLERIES&&window.REAL_GALLERIES[p.id])||[productImage(p)];}
function colors(p){return (window.PRODUCT_COLORS&&window.PRODUCT_COLORS[p.id])||['Preto','Branco','Azul'];}
const API_BASE_URL=window.IPHONE_API_BASE_URL||"https://milho-flakes.onrender.com";
window.addEventListener('error', function(ev){ if(ev && ev.error) console.error('Erro na página do produto:', ev.error); });
async function api(path){const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),6000);try{const r=await fetch(API_BASE_URL+path,{cache:'no-store',signal:ctl.signal});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||`HTTP ${r.status}`);return d;}finally{clearTimeout(timer);}}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function colorPositionFor(id,color){const order=(window.COLOR_IMAGE_ORDER&&window.COLOR_IMAGE_ORDER[id])||[];const idx=order.indexOf(color);const total=order.length||((window.PRODUCT_COLORS&&window.PRODUCT_COLORS[id])||[]).length||1;return idx<0||total<=1?'50%':`${Math.round((idx/(total-1))*100)}%`;}
function colorPhotoFor(id,color){return (window.COLOR_PHOTOS&&window.COLOR_PHOTOS[id]&&window.COLOR_PHOTOS[id][color])||null;}
function colorVariantFor(id,color){const safe=String(color||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); return `assets/products/colors/${id}-${safe}.svg`;}
function colorDisplayFor(id,color){return colorPhotoFor(id,color)||colorVariantFor(id,color);}
function colorHex(c){const x=c.toLowerCase();if(x.includes('rosa'))return '#f3b5c7';if(x.includes('azul'))return '#5c82c9';if(x.includes('verde'))return '#8eaf9c';if(x.includes('roxo')||x.includes('lavanda'))return '#9c8bc4';if(x.includes('amarelo')||x.includes('dourado'))return '#d9bb67';if(x.includes('branco')||x.includes('prateado')||x.includes('estelar')||x.includes('glacial'))return '#f4f4f0';if(x.includes('vermelho')||x.includes('red'))return '#c8102e';if(x.includes('preto')||x.includes('grafite')||x.includes('espacial'))return '#222';if(x.includes('laranja'))return '#e56a22';if(x.includes('bordô'))return '#6b2737';return '#888';}
window.addEventListener('DOMContentLoaded', function(){
 try {
  let p=fallbackProduct();
  if(!p) throw new Error('Produto não encontrado.');
  renderProduct(p);
  // Atualiza preço/dados do servidor em segundo plano, sem bloquear a tela.
  api('/api/products').then(d=>{const fresh=(d.products||[]).find(x=>x.id===id); if(fresh) renderProduct(fresh);}).catch(()=>{});
 } catch(e){
  console.error("iPhone Express produto:", e);
  showFatal(e && e.message ? e.message : "Erro inesperado ao carregar o produto.");
 }
 function renderProduct(p){
  const imgs=(gallery(p)||[]).filter(Boolean).slice(0,3), cs=colors(p);
  const fallback=`assets/products/${p.id}-front.svg`;
  let selected=cs.includes(requestedColor)?requestedColor:cs[0];
  const firstImg=colorDisplayFor(p.id,selected)||imgs[0]||fallback;
  $("detail").innerHTML=`
   <div class="gallery">
    <div class="main-photo"><span class="sale big">30% OFF</span><img id="mainImage" class="main-product-img" src="${esc(firstImg)}" alt="${esc(p.name)} ${esc(selected)}" onerror="this.onerror=null;this.src='${fallback}'"></div>
    <div class="photo-source">Fotos reais/de referência do modelo. A disponibilidade da cor é confirmada antes do envio.</div>
    <div class="thumbs">${imgs.map((src,i)=>`<button class="photo-thumb ${i===0?'active':''}" data-src="${esc(src)}" type="button"><span>${['Foto principal','Traseira','Outra vista'][i]}</span><img src="${esc(src)}" alt="${esc(p.name)}"></button>`).join('')}</div>
   </div>
   <section class="product-detail">
    <span class="eyebrow">OFERTA iPHONE EXPRESS</span><h1>${esc(p.name)}</h1><p class="storage large">${esc(p.storage)}</p>
    <div class="trust-badges"><span>✓ NOVO</span><span>✓ TESTADO</span><span>✓ 30% OFF</span></div>
    <div class="old">Referência de mercado: ${money(p.referencePrice)}</div><div class="detail-price">${money(p.price)}</div>
    <div class="color-box"><label><strong>Escolha a cor</strong><span>Conforme disponibilidade</span></label><div class="color-options" id="colorOptions">${cs.map((c,i)=>`<button type="button" class="color-option ${c===selected?'selected':''}" data-color="${esc(c)}"><i style="background:${colorHex(c)}"></i><span>${esc(c)}</span></button>`).join('')}</div><div class="selected-color"><span>Cor selecionada</span><strong id="selectedColor">${esc(selected)}</strong></div><small>A cor marcada acompanha o pedido. A disponibilidade é confirmada antes do envio.</small></div>
    <div class="included"><span>✓ Frete grátis</span><span>✓ Entrega Full — até 7 dias úteis</span><span>✓ Produto novo e testado</span><span>✓ Pagamento via Pix</span></div>
    <p class="desc">Aparelho novo e testado. Escolha a cor desejada conforme disponibilidade e informe os dados de entrega para continuar.</p>
    <a class="buy large-buy" id="continueBuy" href="checkout.html?id=${encodeURIComponent(p.id)}&color=${encodeURIComponent(selected)}">Continuar para dados de entrega →</a>
    <div class="delivery-note"><strong>🚚 Entrega Full</strong><br>Prazo informado na loja: <strong>até 7 dias úteis</strong>.</div>
    <div class="secure">🔒 O preço do Pix é conferido pelo servidor e não é alterado pelo navegador.</div>
   </section>`;
  const main=$("mainImage");
  const family=(window.FAMILY_PHOTOS&&window.FAMILY_PHOTOS[p.id])||(window.REAL_PHOTOS&&window.REAL_PHOTOS[p.id]);
  const setColorPhoto=(color)=>{ const exact=colorPhotoFor(p.id,color); const src=exact||family||fallback; if(main){ main.style.setProperty('--photo-image',`url("${src.replaceAll('"','%22')}")`); main.style.setProperty('--photo-position',exact?'50%':colorPositionFor(p.id,color)); main.style.setProperty('--color-count',exact?'1':((window.COLOR_IMAGE_ORDER&&window.COLOR_IMAGE_ORDER[p.id])||cs).length); } };
  setColorPhoto(selected);
  document.querySelectorAll('.photo-thumb').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.photo-thumb').forEach(x=>x.classList.remove('active'));b.classList.add('active');main.style.setProperty('--photo-image',`url("${b.dataset.src.replaceAll('\"','%22')}")`);main.style.setProperty('--photo-position','50%');main.style.setProperty('--color-count','1');}));
  document.querySelectorAll('.color-option').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.color-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selected=b.dataset.color;$("selectedColor").textContent=selected;setColorPhoto(selected);document.querySelectorAll('.photo-thumb').forEach(x=>x.classList.remove('active'));$("continueBuy").href=`checkout.html?id=${encodeURIComponent(p.id)}&color=${encodeURIComponent(selected)}`;}));
  $("continueBuy").addEventListener('click',e=>{e.preventDefault();location.href=`checkout.html?id=${encodeURIComponent(p.id)}&color=${encodeURIComponent(selected)}`;});
 }
});
