import express from "express";
import passport from "passport";
import setupJWTStrategy from "./auth/index.js";
import authRouter from "./routes/auth.js"
import recipeRouter from "./routes/recipe.js";

export default function createServer() {
    const app = express();

    app.use(express.json());

    setupJWTStrategy(passport);

    app.use("/auth", authRouter);
    
    app.use("/recipes", recipeRouter(passport));

    return app;
}