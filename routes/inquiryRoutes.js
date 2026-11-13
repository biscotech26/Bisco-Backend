const express = require("express")
const rateLimit = require("express-rate-limit")

const { sendInquiry } = require("../controllers/inquiryController")

const router = express.Router()

// Rate limiting
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Maximum 5 requests per IP
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many inquiries. Please try again later.",
    })
  },
})

// POST /api/inquiry
router.post("/", inquiryLimiter, sendInquiry)

module.exports = router
