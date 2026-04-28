// Middleware to restrict routes based on user roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource is only for ${roles.join(', ')} users.`,
      });
    }

    next();
  };
};

// Middleware for farmer-only routes
export const farmerOnly = (req, res, next) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This resource is only for farmers.',
    });
  }
  next();
};

// Middleware for buyer-only routes
export const buyerOnly = (req, res, next) => {
  if (req.user.role !== 'buyer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This resource is only for buyers.',
    });
  }
  next();
};

// Middleware for admin-only routes
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This resource is only for administrators.',
    });
  }
  next();
};

export default { restrictTo, farmerOnly, buyerOnly, adminOnly };
