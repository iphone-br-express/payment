(function(){
  function money(v){return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function renderFallback(){
    const grid=document.getElementById('products');
    if(!grid || !window.LOCAL_PRODUCTS) return;
    if(!grid.querySelector('.loading')) return;
    const products=window.LOCAL_PRODUCTS;
    const colors=window.PRODUCT_COLORS||{};
    const photos=window.REAL_PHOTOS||{};
    window.__catalogFallbackRendered=true;
    grid.innerHTML=products.map(p=>{
      const cs=colors[p.id]||[]; const first=cs[0]||'';
      const photo=photos[p.id]||('assets/products/'+p.id+'-front.svg');
      return `<article class="product-card"><a class="product-image" href="produto.html?id=${encodeURIComponent(p.id)}&color=${encodeURIComponent(first)}"><span class="sale">30% OFF</span><img src="${photo}" alt="${p.name} ${p.storage}" onerror="this.onerror=null;this.src='assets/products/${p.id}-front.svg'"></a><div class="product-info"><h3>${p.name}</h3><p class="storage">${p.storage}</p><div class="trust-badges"><span>✓ NOVO</span><span>✓ TESTADO</span></div><div class="catalog-colors"><span class="colors-label">Escolha a cor • conforme disponibilidade:</span><div class="color-swatches">${cs.map((c,i)=>`<a class="color-swatch${i===0?' selected':''}" href="produto.html?id=${encodeURIComponent(p.id)}&color=${encodeURIComponent(c)}" title="${c}" aria-label="${c}" style="--swatch:${colorHex(c)}"><span></span></a>`).join('')}</div><span class="selected-color">${first}</span></div><div class="old">De ${money(p.referencePrice)}</div><div class="price">${money(p.price)}</div><div class="shipping">Frete grátis • Full até 7 dias úteis</div><a class="buy" href="produto.html?id=${encodeURIComponent(p.id)}&color=${encodeURIComponent(first)}">Ver produto</a></div></article>`;
    }).join('');
    const count=document.getElementById('count'); if(count) count.textContent=products.length+' opções';
    const status=document.getElementById('catalogStatus'); if(status) status.textContent='';
  }
  function colorHex(c){const m={"Branco":"#f7f7f5","Preto":"#17181b","Azul":"#4bb7f5","Amarelo":"#f6cf4b","Coral":"#ff7568","(PRODUCT)RED":"#d7192f","Dourado":"#e5c29b","Cinza-espacial":"#55565a","Prateado":"#dfe2e5","Roxo":"#8f7aa8","Rosa":"#f5a7b8","Verde":"#6d8f72","Rosa-pálido":"#e5b8c4","Azul-névoa":"#8798b4","Sálvia":"#9ca99a","Lavanda":"#aaa0c5","Azul-intenso":"#244f7b","Laranja-cósmico":"#c65d2d","Glacial":"#cbd3d9","Bordô":"#6b2737"}; return m[c]||'#d1d5db';}
  setTimeout(renderFallback,120);
  setTimeout(renderFallback,700);
  setTimeout(renderFallback,1800);
})();
