import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../db/index.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: req.body.username
            }
        });

        if (user) {
            res.status(401).json({
                success: false,
                message: "User already exists"
            });
        } else {
            try {
                const hashedPassword = await argon2.hash(req.body.password);

                const newUser = await prisma.user.create({
                    data: {
                        username: req.body.username,
                        password: hashedPassword
                    }
                });

                if (newUser) {
                    res.status(201).json({
                        success: true
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: "Failed to create user"
                    });
                };
            } catch (e) {
                res.status(500).json({
                    success: false,
                    message: "Failed to create user"
                });
            };
        };
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    };
});

router.post("/login", async (req, res) => {
    try {
        const foundUser = await prisma.user.findFirstOrThrow({
            where: {
                username: req.body.username
            }
        });

        try {
            const verifiedPassword = await argon2.verify(foundUser.password, req.body.password);

            if (verifiedPassword) {
                const token = jwt.sign({
                    user: {
                        username: foundUser.username,
                        id: foundUser.id
                    }
                }, "verifyMeCapn");

                res.status(200).json({
                    success: true,
                    token
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Incorrect username or password"
                });
            }
        } catch (e) {
            res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        };
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Incorrect username or password"
        });
    };
});

export default router;