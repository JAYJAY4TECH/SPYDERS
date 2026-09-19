const router = require('express').Router();
router.get('/:orderId', (req, res) => res.status(404).json({ error: 'Not found yet' }));
module.exports = router;
