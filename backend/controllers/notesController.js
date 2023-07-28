const asyncHandler = require("express-async-handler");
const executeQuery = require("../utils/executeQueries");

// @desc Create a new Notes
// @route Post /api/notes
// @access Private
const createNotes = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = req.user;

  if (user.length === 0) {
    res.status(400);
    throw new Error("User not found");
  }
  if (!title || !description) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const notes = await executeQuery(
    "INSERT INTO notes (user_id, title, description) VALUES(?, ?,?)",
    [user[0].id, title, description]
  );
  res.status(200).json({
    data: {
      status: true,
      response: notes,
    },
  });
});

// @desc Get all Notes
// @route GET /api/notes
// @access Private
const getNotes = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.length === 0) {
    res.status(400);
    throw new Error("User not found");
  }

  const notes = await executeQuery("SELECT * FROM notes WHERE user_id= ? ", [
    user[0].id,
  ]);
  res.status(200).json({
    data: {
      status: true,
      notes: notes,
    },
  });
});

// @desc Get Single Notes
// @route GET /api/notes
// @access Private
const getSingleNote = asyncHandler(async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  if (user.length === 0) {
    res.status(400);
    throw new Error("User not found");
  }

  const notes = await executeQuery(
    "SELECT * FROM notes WHERE user_id= ? AND id = ?",
    [user[0].id, id]
  );
  res.status(200).json({
    data: notes,
  });
});
// @desc Update Notes
// @route PUT /api/notes
// @access Private
const updateNotes = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const user = req.user;

  if (user.length === 0) {
    res.status(400);
    throw new Error("User not found");
  }
  if (!title || !description) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const oldNotes = await executeQuery("SELECT * FROM notes WHERE id= ? ", [id]);
  console.log(oldNotes);
  if (oldNotes.length === 0) {
    const newNote = await executeQuery(
      "INSERT INTO notes (user_id, title, description) VALUES(?, ?,?)",
      [user[0].id, title, description]
    );
    res.status(200).json({
      data: {
        status: true,
        response: newNote,
      },
    });
  } else {
    const newNote = await executeQuery(
      "UPDATE notes SET title = ?, description = ? WHERE id = ? AND user_id = ? ",
      [title, description, id, user[0].id]
    );
    res.status(200).json({
      data: {
        status: true,
        response: newNote,
      },
    });
  }
});

// @desc Delete a Notes
// @route DELETE /api/notes
// @access Private
const deleteNotes = asyncHandler(async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  if (user.length === 0) {
    res.status(400);
    throw new Error("User not found");
  }

  const notes = await executeQuery(
    "DELETE FROM notes WHERE id= ? AND user_id= ?",
    [id, user[0].id]
  );
  res.status(200).json({
    data: {
      status: true,
      response: notes,
    },
  });
});

module.exports = {
  createNotes,
  getNotes,
  getSingleNote,
  updateNotes,
  deleteNotes,
};
