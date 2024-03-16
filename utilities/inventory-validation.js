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

/*  **********************************
 *  Vehicle Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make") 
            .trim()
            .isLength({ min: 3 })
            .isAlphanumeric()
            .withMessage("Please Provide a make."),

        body("inv_model") 
            .trim()
            .isLength({ min: 3 })
            .isAlphanumeric()
            .withMessage("Please Provide a model."), 

        body("inv_year") 
            .trim()
            .isLength(4)
            .withMessage("Please Provide a year.") 
            .isNumeric(),

        body("inv_description") 
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a description."), 

        body("inv_image") 
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a image path."), 

        body("inv_thumbnail") 
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a thumbnail path."), 

        body("inv_price") 
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a price."), 

        body("inv_color") 
            .trim()
            .isLength({ min: 1 })
            .isAlpha()
            .withMessage("Please Provide a color."), 

        body("classification_id") 
            .trim()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage("Please Provide a Classification.") 
    ]
}

/* ******************************
 * Check data and return errors or continue to add classificatoin
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
    next()
}

/* ******************************
 * Check data and return errors or continue to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let selectClassification = await utilities.selectClassification()
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit Inventory",
            nav,
            selectClassification,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        })
        return
    }
    next()
}

module.exports = validate