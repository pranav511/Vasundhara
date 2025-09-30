const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const brandRoutes = require('./routes/brand');

dotenv.config();
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use('/api/auth',authRoutes);
app.use('/api/brand',brandRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is live at PORT ${PORT}`);
})

