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
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({origin: '*'}))
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running.....");
});
0
app.use("/api/users", userRoutes);






app.use(invalidPathHandler)

app.use(errorResponseHandler)

app.listen(8000, console.log("Server is running"));
