import express from "express";
import { getAdmin, createAdmin, loginAdmin, updateAdmin, deleteAdmin } from "../controllers/admin.controller.js";
import { createAdminValidator, loginAdminValidator } from "../validators/admin.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/login", loginAdminValidator, validate, loginAdmin);
router.post("/create", createAdminValidator, validate, createAdmin);
router.get("/:id_admin", getAdmin);
router.put("/:id_admin", createAdminValidator, validate, updateAdmin);
router.delete("/:id_admin", deleteAdmin);

export default router;
