import express from 'express';
import { followAndunfollowUser,logOutUser, loginUser, myProfile, registerUser, userProfile } from '../Controller/userController.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router()

router.post("/register",registerUser );

router.post("/login",loginUser);

router.get("/logout", isAuth, logOutUser);

router.get("/me", isAuth, myProfile);

router.get("/:id", isAuth, userProfile);

router.post("/follow/:id", isAuth, followAndunfollowUser);

export default router;