const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        // firstname is required and must be string
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a Classification.") // on error this message is sent.
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            })
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
 *  Vehicle Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make") //! Replace with database fields
            .trim()
            .isLength({ min: 3 })
            .isAlphanumeric()
            .withMessage("Please Provide a make."), //! Replace with a better message

        body("inv_model") //! Replace with database fields
            .trim()
            .isLength({ min: 3 })
            .isAlphanumeric()
            .withMessage("Please Provide a model."), //! Replace with a better message

        body("inv_year") //! Replace with database fields
            .trim()
            .isLength(4)
            .withMessage("Please Provide a year.") //! Replace with a better message
            .isNumeric(),

        body("inv_description") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a description."), //! Replace with a better message

        body("inv_image") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a image path."), //! Replace with a better message

        body("inv_thumbnail") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a thumbnail path."), //! Replace with a better message,

        body("inv_price") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a price."), //! Replace with a better message

        body("inv_color") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .isAlpha()
            .withMessage("Please Provide a color."), //! Replace with a better message

        body("classification_id") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage("Please Provide a Classification.") //! Replace with a better message
    ]
}

//! The order of the lists might be need to be in the same order as the form.
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvVehicleData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let selectClassification = await utilities.selectClassification()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            selectClassification,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            // inv_image,
            // inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
        return
    }
    next() //! Maybe get rid of this
}

module.exports = validate