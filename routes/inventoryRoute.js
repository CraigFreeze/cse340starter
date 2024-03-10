// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
router.get("/management", utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addClassification)
);

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post(
    "/add-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkInvVehicleData,
    utilities.handleErrors(invController.addInventory)
    );


router.get("/servererror", utilities.handleErrors(invController.buildByInvId));
module.exports = router;