import express from "express";
import { loginSchema, registerSchema } from "../schemas/auth-schema";
import User from "../models/user-model";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const body = req.body;
  const { error } = registerSchema.validate(body);
  if (error) {
    return res
      .status(400)
      .json({ error: "Error by JOI register" + error.message });
  }
  const isEmailExist = await User.findOne({ email: body.email });
  if (isEmailExist) {
    return res.status(400).json({ error: "Email already exist" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    name: body.name,
    email: body.email,
    password: hashPassword,
  });
  try {
    await user.save();
    return res.json({ message: "User created", user });
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: "Error by register save" + error.message });
  }
});
router.post("/login", async (req, res) => {
  const body = req.body;
  const { error } = loginSchema.validate(body);
  if (error) {
    return res
      .status(400)
      .json({ error: "Error by joi Login" + error.message });
  }
  const isUserExist = await User.findOne({ email: body.email });
  if (!isUserExist) {
    return res.status(400).json({ error: "Email or password is wrong" });
  }
  const validPass = await bcrypt.compare(body.password, isUserExist.password);
  if (!validPass) {
    return res.status(400).json({ error: "Invalid Password" });
  }
  const token = JWT.sign(
    { _id: isUserExist._id },
    process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : "secret"
  );
  return res.header("auth-token", token).send(token);
});

export default router;
