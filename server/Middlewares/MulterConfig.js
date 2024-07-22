const path = require('path');
const multer = require('multer');
const uploadDir = process.env.UPLOAD_DIR || './upload/images';

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;