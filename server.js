import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorResponseHandler, invalidPathHandler } from "./middleware/errorHandler.js";
import cors from "cors"
import bodyParser from "body-parser";
//Routes
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();
const app = express();
app.use(cors({ origin:'*',optionsSuccessStatus:200 }));
// app.options('*', cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running.....");
});
0
app.use("/api/users", userRoutes);






app.use(invalidPathHandler)

app.use(errorResponseHandler)

const port = process.env.PORT || 3000;

app.listen(port,"0.0.0.0", console.log("Server is running"));
