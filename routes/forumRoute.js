// Needed Resources
const express = require("express")
const router = new express.Router()
const forumController = require("../controllers/forumController")
const utilities = require("../utilities")
const forumValidate = require('../utilities/forum-validation')

// Route to forum view
router.get("/comment",
    utilities.checkLogin,
    utilities.handleErrors(forumController.buildForum)
);

// Process a comment post attempt
router.post(
    "/comment",
    utilities.checkLogin,
    forumValidate.commentRules(),
    forumValidate.checkCommentData,
    utilities.handleErrors(forumController.postComment)
)

// Delete a comment
router.post(
    "/delete",
    utilities.checkLogin,
    utilities.handleErrors(forumController.deleteComment)
)

module.exports = router;
