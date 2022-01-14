const express = require("express");
const {
  getUserByCode,
  updateUserByCode,
  createUser,
  searchUsers,
  bulkUpdateUsersStatus,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/users");
const { verifyToken, permittedRoles } = require("../middlewares");
const {
  _ADMIN,
  _GENERAL,
  _VIP,
} = require("../middlewares/roles");
const {
  processValidationError,
} = require("../utils/process-validation-errors");
const { usersValidator } = require("../validators/users");
const router = express.Router();



// ADMIN AUTHENTICATED ROUTES
/**
  * GET user by code           [*]
  * PATCH update user by code  [*]
  * PATCH Purge/Unpurge user   [*]
  * POST Search Users          [*]
 */
router.get("/:code", verifyToken, permittedRoles(..._ADMIN), getUserByCode);
router.patch(
  "/:code",
  verifyToken,
  permittedRoles(..._ADMIN),
  usersValidator("update"),
  processValidationError,
  updateUserByCode
);
router.patch(
  "/status/:isActive",
  verifyToken,
  permittedRoles(..._ADMIN),
  usersValidator("update-user-status"),
  processValidationError,
  bulkUpdateUsersStatus
);
router.post("/search", verifyToken, permittedRoles(..._ADMIN), searchUsers);

// AUTHENTICATED ACCESS ROUTES
/**
 * GET Users profile          [*]
 * PATCH update users profile [*]
 * DELETE Own users account   [*]
 */
router.get(
  "/",
  verifyToken,
  permittedRoles(..._GENERAL, ..._VIP),
  getUserProfile
);
router.patch(
  "/",
  verifyToken,
  permittedRoles(..._GENERAL, ..._VIP),
  updateUserProfile
);
router.delete(
  "/",
  verifyToken,
  permittedRoles(..._GENERAL, ..._VIP),
  deleteUserProfile
);

// NO AUTH ACCESS ROUTES
/**
 * POST Create new user       [*]
 */
router.post("/", usersValidator("create"), processValidationError, createUser);

module.exports = router;
