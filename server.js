import express from "express";
import passport from "passport";
import setupJWTStrategy from "./auth/index.js";
import authRouter from "./routes/auth.js"
import recipeRouter from "./routes/recipe.js";
import userRouter from "./routes/user.js";

export default function createServer() {
    const app = express();

    app.use(express.json());

    setupJWTStrategy(passport);

    app.use("/auth", authRouter);

    app.use("/recipes", recipeRouter);

    app.use(
        "/user/recipes",
        passport.authenticate("jwt", { session: false }),
        userRouter
    );

    return app;
}