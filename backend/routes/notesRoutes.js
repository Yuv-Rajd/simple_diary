const express = require("express");
const router = express.Router();

// import controllers
const {
  createNotes,
  getNotes,
  getSingleNote,
  updateNotes,
  deleteNotes,
} = require("../controllers/notesController");

// import private route middleware

const { protect } = require("../middleware/authMiddleware.js");

// define routes
router.route("/").post(protect, createNotes).get(protect, getNotes);

router
  .route("/:id")
  .get(protect, getSingleNote)
  .put(protect, updateNotes)
  .delete(protect, deleteNotes);

module.exports = router;
