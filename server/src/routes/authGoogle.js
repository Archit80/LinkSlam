import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/auth", session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // false for localhost
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/", // Ensure cookie is sent for all paths
      })
      .redirect("http://localhost:3000/public-feed"); 
  }
);

export default router;
