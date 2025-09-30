const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, Date.now()+"-" +file.fieldname + '-' + path.extname(file.originalname));
    },
})

const fileFilter = (req, file, cb) => {
    const allowTypes = /jpeg|jpg|png/;   
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowTypes.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only image is allowed"));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;