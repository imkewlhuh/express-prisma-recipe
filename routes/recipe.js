import express from "express";
import { prisma } from "../db/index.js";

const router = express.Router();

//GET all recipes sorted by each User
router.get("/", async (_req, res) => {
    const recipes = await prisma.recipe.findMany({
        orderBy: {
            userId: 'asc'
        },
        include: {
            user: true
        }
    });

    res.status(200).json({
        success: true,
        recipes
    })
});

//POST new recipe under specified User
router.post("/", async (req, res) => {
    const newRecipe = await prisma.recipe.create({
        data: {
            name: req.body.name,
            recipe: req.body.recipe,
            userId: req.body.userId
        }
    });
    
    console.log(newRecipe);

    res.status(201).json({
        success: true
    })
});

//GET one recipe by it's unique id
router.get("/:recipeId", async (req, res) => {
    const id = req.params.recipeId;

    const recipe = await prisma.recipe.findUniqueOrThrow({
        where: {
            id: parseInt(id)
        }
    })

    res.status(200).json({
        success: true,
        recipe
    })
});

export default router;