// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// account_firstname: Basic
// account_lastname: Client
// account_email: basic@340.edu
// account_password: I@mABas1cCl!3nt

// account_firstname: Happy
// account_lastname: Employee
// account_email: happy@340.edu
// account_password: I@mAnEmpl0y33

// account_firstname: Manager
// account_lastname: User
// account_email: manager@340.edu
// account_password: I@mAnAdm!n1strat0r

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

router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateAccount));
// Process Update Account
router.post(
    "/accountUpdate",
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)
// Process Password Change
router.post(
    "/changePassword",
    regValidate.updatePasswordRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router;
