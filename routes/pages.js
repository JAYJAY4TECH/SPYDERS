const express = require('express');
const path = require('path');
const router = express.Router();

const views = path.join(__dirname, '..', 'views');
const page  = (file) => (req, res) => res.sendFile(path.join(views, file));

// Public
router.get('/',              page('index.html'));
router.get('/shop',          page('shop.html'));
router.get('/product/:slug', page('product.html'));
router.get('/cart',          page('cart.html'));
router.get('/checkout',      page('checkout.html'));
router.get('/confirmation',  page('confirmation.html'));
router.get('/about',         page('about.html'));
router.get('/contact',       page('contact.html'));
router.get('/collections',   page('collections.html'));
router.get('/search',        page('search.html'));

// Admin
router.get('/admin',                   page('admin/login.html'));
router.get('/admin/login',             page('admin/login.html'));
router.get('/admin/dashboard',         page('admin/dashboard.html'));
router.get('/admin/products',          page('admin/products.html'));
router.get('/admin/products/new',      page('admin/product-form.html'));
router.get('/admin/products/:id/edit', page('admin/product-form.html'));
router.get('/admin/orders',            page('admin/orders.html'));

module.exports = router;
