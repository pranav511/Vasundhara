const validate = (schema) => {
    return (req, res, next) => {
      
      if (data.vehicles && typeof data.vehicles === 'string') {
        try {
          data.vehicles = JSON.parse(data.vehicles);
        } catch (err) {
          return res.status(400).json({ msg: "Invalid vehicles JSON" });
        }
      }
  
      const { error } = schema.validate(data, { abortEarly: false });
  
      if (error) {
        const messages = error.details.map(d => d.message);
        return res.status(400).json({ msg: messages });
      }
  
      next(); 
    };
  };
  
  module.exports = validate;
  