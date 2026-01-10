const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const globalerror = require("./middelware/error_Handel_Middelware");

const AuthRoute = require("./Routes/AuthRoute");

dotenv.config({ path: "config.env" });
const DBconnection = require("./config/database");
DBconnection();

//Express app
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
//schema
//Mount Routes
app.use("/api/v1/auth", AuthRoute);

//middelware
app.use(globalerror);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("app running v4");
});
