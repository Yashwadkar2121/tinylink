const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config({ quiet: true });

const sequelize = require("./config/database.js");
const linkRoutes = require("./routes/links.js");
const redirectRoutes = require("./routes/redirect.js");
const healthRoutes = require("./routes/health.js");
const { errorHandler } = require("./middleware/errorHandler.js");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - SIMPLE AND EFFECTIVE
const allowedOrigins = [
  "https://tinylink-ctecrxnlw-yashs-projects-00930977.vercel.app",
  "https://tinylink-lyart.vercel.app",
  "http://localhost:5173",
  "https://tinylink-frontend.vercel.app",
];

// Enable CORS for all routes
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Add CORS headers manually for additional safety
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(helmet());
app.use(express.json({ limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Routes
app.use("/api/links", linkRoutes);
app.use("/api/healthz", healthRoutes);
app.use("/", redirectRoutes);

// Health check endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "TinyLink API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    allowedOrigins: allowedOrigins,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.redirect("/api");
});

// Error handler
app.use(errorHandler);

// DB & Server init
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync();
    console.log("Database synchronized.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Allowed origins: ${allowedOrigins.join(", ")}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
