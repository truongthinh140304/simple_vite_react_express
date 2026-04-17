import express from "express";
import authService from "../../services/auth.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json(
      successResponse({
        user,
      })
    );
  } catch (err) {
    console.error(err);
    res.status(400).json(errorResponse(err.message || "Register failed"));
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json(successResponse(result));
  } catch (err) {
    console.error(err);
    res.status(400).json(errorResponse(err.message || "Login failed"));
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  res.status(200).json(
    successResponse({
      user: req.user,
    })
  );
});

export default router;