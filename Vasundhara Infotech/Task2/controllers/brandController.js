const db = require('../config/db');

const addBrand = async (req, res) => {
    try {
        const { name, year, is_exists, country, vehicles } = req.body;
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
                "INSERT INTO vehicles (brand_id,name,color,price,image ) VALUES (?,?,?,?,?)",
                [brandId,v.name,v.color.join(","),v.price,img]
            );
            
        }
        
        res.status(201).json({ message: "Brand and vehicles added successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

const updateBrand = async (req, res) => {
    try {
      const brandId = req.params.id;
      const { name, year, is_exist, country, vehicles } = req.body;
      const brandImage = req.files?.brandImage?.[0]?.filename;
  
      
      const brandFields = [];
      const brandValues = [];
  
      if (name) { brandFields.push("name=?"); brandValues.push(name); }
      if (year) { brandFields.push("year=?"); brandValues.push(year); }
      if (is_exist) { brandFields.push("is_exist=?"); brandValues.push(is_exist); }
      if (country) { brandFields.push("country=?"); brandValues.push(country); }
      if (brandImage) { brandFields.push("image=?"); brandValues.push(brandImage); }
  
      if (brandFields.length > 0) {
        brandValues.push(brandId);
        await db.query(`UPDATE brands SET ${brandFields.join(", ")} WHERE id=?`, brandValues);
      }
  
      const vehicleFiles = req.files?.vehicleImages || [];
  
      if (vehicles && vehicles.length > 0) {
        for (let i = 0; i < vehicles.length; i++) {
          const v = vehicles[i];
          const img = vehicleFiles[i]?.filename;
  
          const vehicleFields = [];
          const vehicleValues = [];
  
          if (v.name) { vehicleFields.push("name=?"); vehicleValues.push(v.name); }
          if (v.color) { vehicleFields.push("color=?"); vehicleValues.push(v.color.join(",")); }
          if (v.price) { vehicleFields.push("price=?"); vehicleValues.push(v.price); }
          if (img) { vehicleFields.push("image=?"); vehicleValues.push(img); }
  
          if (vehicleFields.length > 0) {
            vehicleValues.push(v.id); 
            await db.query(`UPDATE vehicles SET ${vehicleFields.join(", ")} WHERE id=?`, vehicleValues);
          }
        }
      }
  
      res.json({ msg: "Brand and vehicles updated successfully" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };


  // Get all brands with their vehicles
const getBrands = async (req, res) => {
    try {
      // 1️⃣ Get all brands
      const [brands] = await db.query("SELECT * FROM brands");
  
      // 2️⃣ For each brand, get its vehicles
      for (let brand of brands) {
        const [vehicles] = await db.query(
          "SELECT * FROM vehicles WHERE brand_id=?",
          [brand.id]
        );
  
        // Convert color CSV to array
        brand.vehicles = vehicles.map(v => ({
          id: v.id,
          name: v.name,
          color: v.color ? v.color.split(",") : [],
          price: v.price,
          image: v.image ? `${req.protocol}://${req.get('host')}/uploads/${v.image}` : null
        }));
  
        // Full brand image URL
        brand.image = brand.image ? `${req.protocol}://${req.get('host')}/uploads/${brand.image}` : null;
      }
  
      res.json({ brands });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  };
  
  module.exports = { addBrand, updateBrand, getBrands };
