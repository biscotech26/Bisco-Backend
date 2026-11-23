require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const cors = require("cors");

const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Allowed frontend origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PRODUCTION_URL,
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as server-to-server
      // requests. Browser requests are checked against allowedOrigins.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Parse JSON requests
app.use(express.json({ limit: "20kb" }));

// Basic health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Biscotech API is running.",
  });
});

// Swagger JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Biscotech API Documentation",
    swaggerOptions: {
      docExpansion: "none",
      filter: true,
      displayRequestDuration: true,
    },
  })
);

// Inquiry routes
app.use("/api/inquiry", inquiryRoutes);

// Handle unexpected errors
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message: "We couldn't send your message. Please try again.",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Biscotech API running on port ${PORT}`);
});