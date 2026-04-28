import express from 'express';

const router = express.Router();

// Placeholder for payment routes
// TODO: Implement payment routes

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payment routes - Coming soon'
  });
});

export default router;
