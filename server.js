const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config({ path: "config.env" });

const globalerror = require("./middelware/error_Handel_Middelware");
const AuthRoute = require("./Routes/AuthRoute");
const NoteRoute = require("./Routes/NoteRoute");
const DBconnection = require("./config/database");

DBconnection();

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(mongoSanitize());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
});

app.use("/api", limiter);

app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/note", NoteRoute);

app.use((req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.use(globalerror);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
