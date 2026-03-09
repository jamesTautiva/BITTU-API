const  {verifyToken} = require('../utils/jwt');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log('=== AUTH DEBUG ===');
  console.log('Auth header:', authHeader);
  console.log('Request URL:', req.url);
  console.log('Method:', req.method);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided or invalid format');
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Token extracted:', token.substring(0, 20) + '...');

  try {
    const decoded = verifyToken(token);
    console.log('Token decoded successfully');
    console.log('User ID:', decoded.id);
    console.log('User role:', decoded.role);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token validation failed:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
