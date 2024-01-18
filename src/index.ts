import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import mongoose, { Error } from "mongoose";
import { router } from "./router";

const app: Express = express();

app.set("view engine", "ejs");

// Middlewares
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/", router);

//const server = http.createServer(app);

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (!isProduction) {
    console.log(`Server running in http://localhost:${PORT}/`);
  }
});

const MONGO_URL = process.env.MONGODB_CONNECTION_STRING;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("open", () => {
  console.info("Connected to MongoDB");
});
mongoose.connection.on("error", (error: Error) => {
  console.error(error);
});
