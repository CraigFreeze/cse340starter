// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

router.get(
    "/",
    // utilities.checkLogin,
    utilities.checkAdminLogin,
    utilities.handleErrors(invController.buildManagement)
);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inv_id",
    utilities.checkAdminLogin,
    utilities.handleErrors(invController.editInventoryView)
);

router.post(
    "/update",
    utilities.checkAdminLogin,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

router.get(
    "/add-classification",
    utilities.checkAdminLogin,
    utilities.handleErrors(invController.buildAddClassification)
);
router.post(
    "/add-classification",
    utilities.checkAdminLogin,
    invValidate.classificationRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addClassification)
);

router.get(
    "/add-inventory",
    utilities.checkAdminLogin,
    utilities.handleErrors(invController.buildAddInventory)
);
router.post(
    "/add-inventory",
    utilities.checkAdminLogin,
    invValidate.inventoryRules(),
    invValidate.checkInvVehicleData,
    utilities.handleErrors(invController.addInventory)
);

router.get(
    "/delete/:inv_id",
    utilities.checkAdminLogin,
    utilities.handleErrors(invController.buildDeleteInvConfirmView)
);
router.post(
    "/delete",
    utilities.checkAdminLogin,
    utilities.handleErrors(invController.deleteInventory)
);


router.get("/servererror", utilities.handleErrors(invController.buildByInvId));
module.exports = router;