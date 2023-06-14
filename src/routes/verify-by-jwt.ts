import Joi, { func } from "@hapi/joi";
import Jwt from "jsonwebtoken";

export const verifyByJwt = function (req: any, res: any, next: any) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  try {
    const verified = Jwt.verify(
      token,
      process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : "secret"
    );
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
