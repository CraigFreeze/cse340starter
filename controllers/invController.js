const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by Vehicle view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getVehicleByInvId(inv_id)
  const details = await utilities.buildVehicleDetails(data)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    details,
  })
}

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav
  })
}

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav
  })
}

/* ****************************************
*  Process add Classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {  
  // DELETE FROM public.classification WHERE classification_id > 5;
  // Use this ^^^ to reset classifications.

  const { classification_name } = req.body

  const regResult = await invModel.addClassification(classification_name)

  let nav = await utilities.getNav() //consider moving this after the regResult

  if (regResult) {
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })
    req.flash(
      "notice",
      `You've successfully added ${classification_name}.`
    )
  } else {
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav
    })
    req.flash("notice", "Sorry, the registration failed.")
  }
}

/* ***************************
 *  Build Add-Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav
  })
}

module.exports = invCont