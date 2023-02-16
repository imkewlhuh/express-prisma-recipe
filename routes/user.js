import express from "express";
import { prisma } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const recipes = await prisma.recipe.findMany({
            where: {
                userId: req.user.id
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
            message: "Something went wrong"
        });
    };
});

router.post("/new", async (req, res) => {
    try {
        const newRecipe = await prisma.recipe.create({
            data: {
                name: req.body.name,
                recipe: req.body.recipe,
                userId: req.user.id
            }
        });

        if (newRecipe) {
            res.status(201).json({
                success: true
            });
        };
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Failed to create"
        });
    };
});

router.put("/:recipeId", async (req, res) => {
    const id = req.params.recipeId;

    try {
        const recipe = await prisma.recipe.findFirstOrThrow({
            where: {
                id: parseInt(id),
                userId: req.user.id
            }
        });

        if (recipe) {
            const updatedRecipe = await prisma.recipe.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name: req.body.name,
                    recipe: req.body.recipe
                }
            });

            if (updatedRecipe) {
                res.status(200).json({
                    success: true
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Failed to update recipe"
                });
            };
        };
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Could not find recipe"
        });
    };
});

router.delete("/:recipeId", async (req, res) => {
    const id = req.params.recipeId;

    try {
        const recipe = await prisma.recipe.findFirstOrThrow({
            where: {
                id: parseInt(id),
                userId: req.user.id
            }
        });

        if (recipe) {
            const deleteRecipe = await prisma.recipe.delete({
                where: {
                    id: parseInt(id)
                }
            });

            if (deleteRecipe) {
                res.status(200).json({
                    success: true
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Failed to delete recipe"
                });
            };
        } else {
            res.status(500).json({
                success: false,
                message: "Something went wrong"
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