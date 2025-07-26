const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  console.log('Session in middleware:', req.session); // Debugging
  if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Unauthorized: please log in first.' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  console.log('Session Data:', req.session);

  if (
    req.session && 
    req.session.user && 
    req.session.user.role ) {
      console.log('User Role:', req.session.user.role);
    if (req.session.user.role === 'admin' || req.session.user.role === 'superadmin') {
      console.log('Access granted');
      next(); // Allow access
  } 
}else {
    console.log('Access denied');
      return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { isAdmin };

