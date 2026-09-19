const router = require('express').Router();
router.get('/me', (req, res) => res.json({ admin: req.session?.admin || null }));
module.exports = router;
