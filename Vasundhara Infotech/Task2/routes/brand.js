const express = require('express');
const router = express.Router();   
const upload = require('../middleware/upload');
const { verifyToken, authorize} = require('../middleware/auth');
const { addBrand, updateBrand, getBrands } = require('../controllers/brandController');

router.post('/add', verifyToken,authorize("admin"),upload.fields([
    {
        name:"brandImage",maxCount:1
    },
    {
        name:"vehicleImages",maxCount:1
    }
]), addBrand);

router.put(
    "/update/:id",
    verifyToken,
    authorize("admin"),
    upload.fields([
      { name: "brandImage", maxCount: 1 },
      { name: "vehicleImages", maxCount: 10 },
    ]),
    updateBrand
  );
  router.get("/all", verifyToken, authorize("admin", "customer"), getBrands);

module.exports = router;
