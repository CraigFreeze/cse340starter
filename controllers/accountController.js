// Account Controller (deliver login view)

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***************************
 *  Deliver login view
 *  Unit 4, deliver login view
 * ************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.flash("notice", "Login Successful")
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

/* ***************************
 *  Deliver Registration view
 *  Unit 4, deliver login view
 * ************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  //Send to Model
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Deliver Registration view
 *  Unit 4, deliver login view
 * ************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Logout Controller
 * ************************** */
async function logout(req, res, next) {
  utilities.logout(req, res, next);
}


/* ***************************
 *  Build Edit Account view
 * ************************** */
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  const accountName = `${accountData.account_firstname} ${accountData.account_lastname}`
  res.render("account/update", {
    title: "Modify the account for " + accountName,
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  let { account_id, account_firstname, account_lastname, account_email } = req.body

  //Send to Model
  const modelResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (modelResult) {
    const accountData = await accountModel.getAccountByEmail(account_email)
    console.log("here")
    console.log(accountData)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    console.log(accessToken)
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }

    req.flash(
      "notice",
      `Your account info, ${account_firstname} has been updated.`
    )
    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  } else {
    req.flash("notice", "Sorry, the account update failed.")
    const accountName = `${account_firstname} ${account_lastname}`
    res.status(501).render("account/update", {
      title: "Modify the account for " + accountName,
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ****************************************
*  Process Password Update
* *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email, account_password } = req.body
  const accountName = `${account_firstname} ${account_lastname}`

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error changing your password.')
    res.status(500).render("account/update", {
      title: "Modify the account for " + accountName,
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }

  //Send to Model
  const modelResult = await accountModel.changePassword(
    account_id,
    hashedPassword
  )

  if (modelResult) {
    req.flash(
      "notice",
      `You successfully changed your password.`
    )
    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/update", {
      title: "Modify the account for " + accountName,
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

module.exports = { buildLogin, registerAccount, buildRegister, accountLogin, buildAccountManagement, logout, buildUpdateAccount, updateAccount, changePassword }