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

// Simple CORS configuration that works for both development and production
const allowedOrigins = [
  "https://tinylink-ctecrxnlw-yashs-projects-00930977.vercel.app",
  "https://tinylink-lyart.vercel.app",
  "http://localhost:5173",
  "https://tinylink-frontend.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(helmet());
app.use(express.json({ limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(limiter);

// Routes
app.use("/api/links", linkRoutes);
app.use("/api/healthz", healthRoutes);
app.use("/", redirectRoutes);

// Simple health check
app.get("/", (req, res) => {
  res.json({
    message: "TinyLink API is running!",
    timestamp: new Date().toISOString(),
  });
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
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
