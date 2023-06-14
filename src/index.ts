import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import Product from "./models/product-model";
import products from "./products";

dotenv.config();

const port = process.env.PORT || 5000;
const db = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.gcavqet.mongodb.net/`;
const app = express();

app.use(express.json());

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error while MongoDB", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/postProducts", async (req, res) => {
  products.map(async (product, i) => {
    const product_ = new Product(product);
    try {
      await product_.save();
      console.log("Product saved", i);
    } catch (error) {
      console.log("Error while saving product", error);
    }
  });
});

app.use("/api/auth", authRouter);
app.use("/api/products", userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
