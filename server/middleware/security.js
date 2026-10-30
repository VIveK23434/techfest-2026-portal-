/**
 * Security helper middleware and input sanitizers
 */

// Helper to escape HTML characters to prevent Stored / Reflected XSS
const sanitizeHtmlString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Custom middleware to sanitize request body strings against XSS
const xssClean = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtmlString(req.body[key]);
      }
    });
  }
  next();
};

// Check for dangerous NoSQL query operators ($gt, $ne, $where, etc.)
const preventNoSqlInjection = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (/^\$/.test(key) || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
};

// Cookie security options for production / local
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true, // Prevents JavaScript from reading the cookie (mitigates XSS token theft)
    secure: isProduction, // Send only over HTTPS in production
    sameSite: isProduction ? 'None' : 'Lax', // Protects against CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

module.exports = {
  sanitizeHtmlString,
  xssClean,
  preventNoSqlInjection,
  getCookieOptions,
};
