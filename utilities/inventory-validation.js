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
            .isLength({ min: 1 })
            .withMessage("Please Provide a Classification.") //! Replace with a better message
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            }),

        body("inv_model") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a Classification.") //! Replace with a better message
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            }),

        body("inv_year") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a Classification.") //! Replace with a better message
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            }),

        body("inv_description") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a Classification.") //! Replace with a better message
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            }),

        body("inv_image") //! Replace with database fields
            .trim()
            .withMessage("Please Provide a Classification.") //! Replace with a better message
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            }),

        body("inv_thumbnail") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a Classification.") //! Replace with a better message
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            }),

        body("inv_price") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a Classification.") //! Replace with a better message
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            }),

        body("inv_color") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a Classification.") //! Replace with a better message
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            }),

        body("classification_id") //! Replace with database fields
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please Provide a Classification.") //! Replace with a better message
            .isAlpha()
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use the existing Classification or create a new one.")
                }
            })
    ]
}

//! The order of the lists might be need to be in the same order as the form.
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvVehicleData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
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
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
        return
    }
    next()
}

module.exports = validate