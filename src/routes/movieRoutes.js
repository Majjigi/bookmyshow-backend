import { Router } from "express";
import movieController from "../controllers/movieController.js";
import verifyJWT, { authorizeRoles } from "../middlewares/authMiddleware.js";
import { UserRoles } from "../models/userModel.js";

const router = Router();

/**
 * PUBLIC ROUTES
 * Anyone can browse and view movie details
 */
// router.get("/", movieController.listMovies);
router.get("/:id", movieController.getMovieDetails);

/**
 * PROTECTED ROUTES (Admin/SuperAdmin only)
 * Only platform owners can manage the global movie catalog
 */
router.post(
  "/create",
  verifyJWT,
  authorizeRoles(UserRoles.PARTNER,UserRoles.ADMIN, UserRoles.SUPERADMIN),
  movieController.createMovie
);

router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles(UserRoles.ADMIN, UserRoles.SUPERADMIN),
  movieController.updateMovie
);

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles(UserRoles.ADMIN, UserRoles.SUPERADMIN),
  movieController.removeMovie
);

router.post(
  "/listMovies",
  movieController.listMovies
);

export default router;
