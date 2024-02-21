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
  console.log("INVENTORY ID")
  console.log(inv_id)
  const data = await invModel.getVehicleByInvId(inv_id)
  console.log("data has entered the party")
  console.log(data);
  const details = await utilities.buildVehicleDetails(data)
  console.log("DETAILS arrived")
  console.log(details);
  let nav = await utilities.getNav()
  // const className = data[0].classification_name
  res.render("./inventory/vehicle", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    details,
  })
}

module.exports = invCont