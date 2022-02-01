const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../Midware/fetchuser");
const { body, validationResult } = require("express-validator");

//Route 1: Fetch all notes by GET : '/api/notes/fetchallnotes'  login require;

router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.massage);
        return res.status(500).send("Some Server error Occured");
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Route 2: Add a note by POST : '/api/notes/addnote'  login require;

router.post(
    "/addnote",
    fetchuser,
    [
        body("title", "Name must be atleast 3 characters")
            .isLength({
                min: 3
            }),
        body("description", "Password must be atleast 5 characters")
            .isLength({
                min: 5,
            }),
    ],
    async (req, res) => {
        try {
            // if user enters any errors occours then shows into res;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { title, description, tag } = req.body;
            const note = new Notes({
                title,
                description,
                tag,
                user: req.user.id,
            });
            const saveNote = await note.save();
            res.json(saveNote);
        } catch (error) {
            console.error(error.massage);
            return res.status(500).send("Some Server error Occured");
        }
    }
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Route 3: Update a note by PUT : '/api/notes//updatenote/:id'  login require;

router.put("/updatenote/:id", fetchuser, async (req, res) => {
    try {
        // if user enters any errors occours then shows into res;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, tag } = req.body;
        // Creat new note object
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(500).send("Not Found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowd");
        }
        note = await Notes.findByIdAndUpdate(
            req.params.id,
            { $set: newNote },
            { new: true }
        );
        res.json(note);
    } catch (error) {
        console.error(error.massage);
        return res.status(500).send("Some Server error Occured");
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Route 4: Delete a note by PUT : '/api/notes/deletenote/:id'  login require;

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        // if user enters any errors occours then shows into res;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Find the note to be delete;
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(500).send("Not Found");
        }

        // Allow deletion only if user own this notes;
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowd");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ Success: "The note has been Deleted", note });
    } catch (error) {
        console.error(error.massage);
        return res.status(500).send("Some Server error Occured");
    }
});

module.exports = router;
