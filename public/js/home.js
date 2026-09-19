// ============================================================
// SPYDERS CLOTHER — Homepage Loader
// ============================================================
(function () {

  // ---------- Product card template (matches YL aesthetic) ----------
  function cardHTML(p) {
    const hasSale = p.salePrice && p.salePrice < p.price;
    const finalPrice = hasSale ? p.salePrice : p.price;
    const img1 = (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';
    const img2 = (p.images && p.images[1]) || img1;

    const badge = hasSale
      ? '<span class="badge sale">Sale</span>'
      : (p.newArrival ? '<span class="badge new">New</span>' : '');

    const colorDots = (p.colors || []).slice(0, 4).map(c =>
      `<span class="w-2.5 h-2.5 rounded-full border border-black/10" style="background:${c.hex || '#000'}" title="${c.name}"></span>`
    ).join('');

    const priceMarkup = hasSale
      ? `<span class="text-sale font-semibold">₦${finalPrice.toLocaleString()}</span>
         <span class="text-ink/40 line-through text-xs ml-2">₦${p.price.toLocaleString()}</span>`
      : `<span>₦${finalPrice.toLocaleString()}</span>`;

    return `
      <article class="product-card group">
        <a href="/product/${p.slug}" aria-label="View ${p.name}">
          <div class="card-media">
            ${badge}
            <img src="${img1}" alt="${p.name}" class="primary" loading="lazy" />
            <img src="${img2}" alt="${p.name} alternate view" class="img-secondary" loading="lazy" />
          </div>
        </a>
        <div class="pt-4 px-1 text-center">
          <h3 class="font-display text-[11px] md:text-xs font-semibold uppercase tracking-[0.1em] mb-1.5">
            <a href="/product/${p.slug}" class="hover:text-accent transition-colors">${p.name}</a>
          </h3>
          ${colorDots ? `<div class="flex justify-center gap-1.5 mb-2">${colorDots}</div>` : ''}
          <div class="flex items-center justify-center gap-1 text-sm font-body">${priceMarkup}</div>
        </div>
        <button
          class="quick-add"
          data-quick-add
          data-product-slug="${p.slug}"
          aria-label="Add ${p.name} to bag"
        >Choose Options</button>
      </article>
    `;
  }

  // ---------- Skeleton cards while loading ----------
  function skeletonCards(count = 4) {
    return Array.from({ length: count }, () => `
      <div class="product-card">
        <div class="card-media skeleton"></div>
        <div class="pt-4 text-center">
          <div class="h-3 w-3/4 mx-auto skeleton mb-2"></div>
          <div class="h-3 w-1/3 mx-auto skeleton"></div>
        </div>
      </div>
    `).join('');
  }

  // ---------- Loader ----------
  async function loadGrid(elId, query) {
    const el = document.getElementById(elId);
    if (!el) return;

    // Show skeletons
    el.innerHTML = skeletonCards(4);

    try {
      const data = await window.API.get('/products' + query);
      const list = data.products || [];

      if (!list.length) {
        el.innerHTML = '<p class="col-span-full text-center text-ink/40 py-16 font-display text-xs tracking-[0.25em] uppercase">No products yet</p>';
        return;
      }

      el.innerHTML = list.slice(0, 8).map(cardHTML).join('');

      // Attach quick-add handlers
      el.querySelectorAll('[data-quick-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const slug = btn.dataset.productSlug;
          window.location.href = '/product/' + slug;
        });
      });
    } catch (err) {
      console.error('[home.js] Failed to load products:', err);
      el.innerHTML = '<p class="col-span-full text-center text-sale py-16 font-display text-xs tracking-[0.25em] uppercase">Could not load products</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadGrid('newArrivalsGrid', '?sort=newest&limit=8');
    loadGrid('bestSellersGrid', '?sort=featured&limit=8');
  });
})();
