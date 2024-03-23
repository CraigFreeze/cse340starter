const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message.") //notice - info, error - something needs to be fixed
  res.render("index", {
    title: "Home",
    nav,
  })
}

module.exports = baseController