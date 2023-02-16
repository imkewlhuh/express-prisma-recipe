import express from "express";
import { prisma } from "../db/index.js";

const router = express.Router();

//GET all recipes sorted by each User
router.get("/", async (_req, res) => {
    try {
        const recipes = await prisma.recipe.findMany({
            orderBy: {
                userId: 'asc'
            }
        });

        if (recipes) {
            res.status(200).json({
                success: true,
                recipes
            });
        };
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Could not find recipes"
        });
    };
});

//GET one recipe by it's unique id
router.get("/:recipeId", async (req, res) => {
    const id = req.params.recipeId;

    try {
        const recipe = await prisma.recipe.findFirstOrThrow({
            where: {
                id: parseInt(id)
            }
        });

        if (recipe) {
            res.status(200).json({
                success: true,
                recipe
            });
        };
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Could not find recipe"
        });
    };
});

export default router;