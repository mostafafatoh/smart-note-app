const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const globalerror = require("./middelware/error_Handel_Middelware");
const AuthRoute = require("./Routes/AuthRoute");
const NoteRoute = require("./Routes/NoteRoute");
const DBconnection = require("./config/database");
DBconnection();

//Express app
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

//schema
//Mount Routes
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/Note", NoteRoute);
//middelware
app.use(globalerror);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("app running v4");
});
