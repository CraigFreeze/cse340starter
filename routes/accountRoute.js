// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(
        (req, res) => {
            res.status(200).send('login process')
        }
    )
)

router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process Registration
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;