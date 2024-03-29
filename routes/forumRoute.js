// Needed Resources
const express = require("express")
const router = new express.Router()
const forumController = require("../controllers/forumController")
const utilities = require("../utilities")
// const forumValidate = require('../utilities/forum-validation')
// ! Add middleware to make sure the user is logged in


// Route to forum comment management view
router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(forumController.buildForumManagement)
);

// Route to forum view
router.get("/comment",
    utilities.checkLogin,
    utilities.handleErrors(forumController.buildForum)
);
// Process a comment post attempt
router.post(
    "/comment",
    // forumValidate.loginRules(),
    // forumValidate.checkLoginData,
    utilities.handleErrors(forumController.postComment)
)

module.exports = router;

// ! NOTE TO SELF, ADD THE CHECK FOR ADMIN TO ***ALL**** THE ADMIN VIEWS