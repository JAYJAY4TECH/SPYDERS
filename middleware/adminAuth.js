// Admin session guard — used on protected admin API routes
module.exports = function adminAuth(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ error: 'Unauthorized — admin login required' });
};
