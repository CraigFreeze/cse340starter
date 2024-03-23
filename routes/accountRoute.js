// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')


// Route to account management view
router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process Registration
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Route to build inventory by classification view
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;



// ! NOTE TO SELF, ADD THE CHECK FOR ADMIN TO ***ALL**** THE ADMIN VIEWS