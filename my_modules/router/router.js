const express = require("express");
const router = express.Router();

// My modules

// Exporting functions controlling responses

const routeController = require("./../controllers/controller");

router
  .route("/kids/allkids")
  .get(routeController.getFullList)
  .post(routeController.postNewKid)
  .patch(routeController.updateKidInfo)
  .delete(routeController.deleteKidInfo);


  // Handle the POST request to /send-email
router.post('/send-email', routeController.sendMail);

module.exports = router;