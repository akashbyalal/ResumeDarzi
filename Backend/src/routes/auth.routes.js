const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = Router();
const authMiddleware = require("../middlewares/auth.middlewares")

/**
 * @route POST /api/auth/register
 * @description register new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * -Post /api/auth/login
 *
 * -Login a user
 */
authRouter.post("/login", authController.loginUserController);


/**
 * - post /api/auth/logout
 * 
 * -Logout a user
 */
authRouter.post("/logout", authController.logoutUserController)


/**
 * -Get /api/auth/get-me
 * -Get current logged in user Details
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeUserController)


module.exports = authRouter;
