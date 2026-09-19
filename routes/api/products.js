const router = require('express').Router();
router.get('/',        (req, res) => res.json({ products: [] }));
router.get('/:slug',   (req, res) => res.status(404).json({ error: 'Not found yet' }));
module.exports = router;
