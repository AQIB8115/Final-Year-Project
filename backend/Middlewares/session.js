const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: 'User not logged in' });
    }
  };
  
  module.exports = checkSession;
  