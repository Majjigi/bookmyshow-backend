import { Router } from "express";
import { venueController } from "../controllers/venueController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/authMiddleware.js";
import { UserRoles } from "../models/userModel.js";

const router = Router();

/**
 * PUBLIC ROUTES
 */
router.get("/", venueController.listVenues);
router.get("/all", venueController.listAllVenues);

/**
 * PROTECTED ROUTES (Partner & Admin)
 */
router.post(
  "/createVenue",
  verifyJWT,
  authorizeRoles(UserRoles.PARTNER, UserRoles.ADMIN),
  venueController.registerVenue
);

router.get(
  "/my-venues",
  verifyJWT,
  authorizeRoles(UserRoles.PARTNER),
  venueController.getMyVenues
);

router.get(
  "/:city",
  verifyJWT,
  authorizeRoles(UserRoles.PARTNER),
  venueController.getSpecificVenueByCity
);

export default router;