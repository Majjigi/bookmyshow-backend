import { Router } from "express";
import { showController } from "../controllers/showController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/authMiddleware.js";
import { UserRoles } from "../models/userModel.js";

const router = Router();

/**
 * PUBLIC ROUTES
 * Customers check schedules for a specific movie
 */
router.get("/movie/:movieId", showController.getMovieShows);

/**
 * PROTECTED ROUTES
 * Partners manage their own venue schedules
 */
router.post(
  "/addShow",
  verifyJWT,
  authorizeRoles(UserRoles.PARTNER, UserRoles.ADMIN),
  showController.addShow
);

router.get(
  "/venue/:venueId",
  verifyJWT,
  authorizeRoles(UserRoles.PARTNER, UserRoles.ADMIN),
  showController.getVenueSchedule
);

export default router;