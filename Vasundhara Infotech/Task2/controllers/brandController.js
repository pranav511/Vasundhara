const db = require('../config/db');

const addBrand = async (req, res) => {
  try {
    let { name, year, is_exists, country, vehicles } = req.body;

    if (typeof vehicles === "string") {
      vehicles = JSON.parse(vehicles);
    }

    const brandImage = req.files?.brandImage?.[0]?.filename || null;

    const [brandResult] = await db.query(
      "INSERT INTO brands (name, year, is_exists, country, image) VALUES (?,?,?,?,?)",
      [name, year, is_exists, country, brandImage]
    );

    const brandId = brandResult.insertId;

    const vehicleFiles = req.files?.vehicleImages || [];

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      const img = vehicleFiles[i]?.filename || null;

      await db.query(
        "INSERT INTO vehicles (brand_id, name, color, price, image) VALUES (?,?,?,?,?)",
        [
          brandId,
          v.name,
          Array.isArray(v.color) ? v.color.join(",") : "", 
          v.price,
          img,
        ]
      );
    }

    res.status(201).json({ message: "Brand and vehicles added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

  
const getBrands = async (req, res) => {
    try {
     
      const [brands] = await db.query("SELECT * FROM brands");
  
      for (let brand of brands) {
        const [vehicles] = await db.query(
          "SELECT * FROM vehicles WHERE brand_id=?",
          [brand.id]
        );
  
        brand.vehicles = vehicles.map(v => ({
          id: v.id,
          name: v.name,
          color: v.color ? v.color.split(",") : [],
          price: v.price,
          image: v.image ? `${req.protocol}://${req.get('host')}/uploads/${v.image}` : null
        }));
  
        brand.image = brand.image ? `${req.protocol}://${req.get('host')}/uploads/${brand.image}` : null;
      }
  
      res.json({ brands });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };

  const updateBrand = async (req, res) => {
    try {
      const brandId = req.params.id;
      let { name, year, is_exist, country, vehicles } = req.body;
  
      if (typeof vehicles === "string") vehicles = JSON.parse(vehicles);
  
      const brandImage = req.files?.brandImage?.[0]?.filename;
  
      const brandFields = [];
      const brandValues = [];
  
      if (name) brandFields.push("name=?") && brandValues.push(name);
      if (year) brandFields.push("year=?") && brandValues.push(year);
      if (is_exist) brandFields.push("is_exist=?") && brandValues.push(is_exist);
      if (country) brandFields.push("country=?") && brandValues.push(country);
      if (brandImage) brandFields.push("image=?") && brandValues.push(brandImage);
  
      if (brandFields.length > 0) {
        brandValues.push(brandId);
        await db.query(`UPDATE brands SET ${brandFields.join(", ")} WHERE id=?`, brandValues);
      }
  
      const vehicleFilesMap = {};
      if (req.files?.vehicleImages) {
        for (const file of req.files.vehicleImages) {
         
          const match = file.fieldname.match(/vehicle_(\d+)/);
          if (match) vehicleFilesMap[match[1]] = file.filename;
        }
      }
  
      
      if (vehicles && vehicles.length > 0) {
        for (const v of vehicles) {
          const img = v.id ? vehicleFilesMap[v.id] : null;
  
          if (v.id) {
            const vehicleFields = [];
            const vehicleValues = [];
  
            if (v.name) vehicleFields.push("name=?") && vehicleValues.push(v.name);
            if (v.color) vehicleFields.push("color=?") && vehicleValues.push(Array.isArray(v.color) ? v.color.join(",") : "");
            if (v.price) vehicleFields.push("price=?") && vehicleValues.push(v.price);
            if (img) vehicleFields.push("image=?") && vehicleValues.push(img);
  
            if (vehicleFields.length > 0) {
              vehicleValues.push(v.id);
              await db.query(`UPDATE vehicles SET ${vehicleFields.join(", ")} WHERE id=?`, vehicleValues);
            }
          } else {
            await db.query(
              "INSERT INTO vehicles (brand_id,name,color,price,image) VALUES (?,?,?,?,?)",
              [
                brandId,
                v.name,
                Array.isArray(v.color) ? v.color.join(",") : "",
                v.price,
                img || null,
              ]
            );
          }
        }
      }
  
      res.json({ msg: "Brand and vehicles updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };

  const deleteBrand = async (req, res) => {
    try {
      const brandId = req.params.id;
  
      
      await db.query("DELETE FROM vehicles WHERE brand_id=?", [brandId]);
  
      
      const [result] = await db.query("DELETE FROM brands WHERE id=?", [brandId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Brand not found" });
      }
  
      res.json({ msg: "Brand and all associated vehicles deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };

  const deleteVehicle = async (req, res) => {
    try {
      const vehicleId = req.params.id;
  
      const [result] = await db.query("DELETE FROM vehicles WHERE id=?", [vehicleId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Vehicle not found" });
      }
  
      res.json({ msg: "Vehicle deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };
  
  
  module.exports = { addBrand, updateBrand, getBrands, deleteBrand, deleteVehicle };
