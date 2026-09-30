import jwt from "jsonwebtoken";

export function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: String(userId),
    expiresIn: "7d",
  });
}
