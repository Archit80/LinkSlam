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

    res.redirect(`https://link-slam.vercel.app/auth/callback?token=${token}`);
  }
);

export default router;
