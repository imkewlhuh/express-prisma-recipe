import express from "express";
import { prisma } from "../db/index.js";


export default function recipeRouter(passport) {
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

    //GET one recipe by it's unique id, or pass if "user"
    router.get("/:recipeId", async (req, res, next) => {
        const id = req.params.recipeId;
        if (id === "user") {
            next('route');
        } else {
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
        }
    });

    //GET all recipes belonging to currently logged in user
    router.get(
        "/user",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
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
                    message: "You must be logged in!"
                });
            };
        });

    //POST new recipe assigned to currently logged in user
    router.post(
        "/new",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
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

    //PUT changes to a recipe belonging to currently logged in user
    router.put(
        "/:recipeId",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
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

    //DELETE a recipe belonging to currently logged in user
    router.delete(
        "/:recipeId",
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
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
    return router;
};