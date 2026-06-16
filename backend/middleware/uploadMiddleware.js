import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Check file types
const checkFileType = (allowedTypes) => {
  return (req, file, cb) => {
    const filetypes = allowedTypes;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error(`Error: Files of type ${filetypes} only!`));
    }
  };
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'backend/uploads/';
    if (file.fieldname === 'resume') {
      dest += 'resumes/';
    } else if (file.fieldname === 'logo') {
      dest += 'logos/';
    } else {
      dest += 'profiles/';
    }

    // Ensure directory exists
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configure upload instances
export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: checkFileType(/pdf/)
}).single('resume');

export const uploadLogo = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: checkFileType(/jpeg|jpg|png|webp/)
}).single('logo');

export const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: checkFileType(/jpeg|jpg|png|webp/)
}).single('profilePhoto');
