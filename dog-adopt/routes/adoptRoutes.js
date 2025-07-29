const { Router } = require("express");
const adoptController = require("../controllers/adoptController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/register", requireAuth, adoptController.register_get);
router.post("/register", requireAuth, adoptController.register_post);
router.get("/adopt", requireAuth, adoptController.adopt_get);
router.post("/adopt/:id", requireAuth, adoptController.adopt_post);
router.get("/yourdogs", requireAuth, adoptController.yourdogs_get);

module.exports = router;
