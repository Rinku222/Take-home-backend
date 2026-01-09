const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { RsvpRoute, AuthRoute, UserRoute, EventRoute } = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/events", EventRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    result: {
      success: false,
      message: err.message || "Internal server error",
    },
  });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
