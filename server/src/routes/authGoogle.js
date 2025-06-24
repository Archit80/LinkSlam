import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

router.get("/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax", // bcoz frontend on vercel and backend on render
        secure: false, // true in prod
      })
      .redirect("http://localhost:3000/dashboard"); // change as needed
  }
);

export default router;
