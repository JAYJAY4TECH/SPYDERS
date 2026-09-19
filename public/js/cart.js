// SPYDERS CLOTHER — Cart engine (localStorage)
(function () {
  const KEY = 'spyders_cart_v1';
  const read  = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const write = (items) => {
    localStorage.setItem(KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
    updateBadge(items);
  };
  const updateBadge = (items) => {
    const count = items.reduce((s, i) => s + (i.quantity || 0), 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  };
  const keyOf = (i) => i.productId + '__' + (i.size||'') + '__' + (i.color||'');

  window.SpydersCart = {
    get items() { return read(); },
    count()     { return read().reduce((s,i)=>s+(i.quantity||0),0); },
    subtotal()  { return read().reduce((s,i)=>s+i.price*i.quantity,0); },
    add(item) {
      const items = read();
      const existing = items.find(i => keyOf(i) === keyOf(item));
      if (existing) existing.quantity = Math.min(existing.quantity + (item.quantity||1), item.stock || 99);
      else items.push({ ...item, quantity: item.quantity || 1 });
      write(items);
      return items;
    },
    update(productId, size, color, quantity) {
      const items = read();
      const idx = items.findIndex(i => i.productId===productId && i.size===size && i.color===color);
      if (idx > -1) { if (quantity <= 0) items.splice(idx,1); else items[idx].quantity = quantity; write(items); }
      return items;
    },
    remove(productId, size, color) {
      const items = read().filter(i => !(i.productId===productId && i.size===size && i.color===color));
      write(items); return items;
    },
    clear() { write([]); }
  };

  document.addEventListener('DOMContentLoaded', () => updateBadge(read()));
})();
