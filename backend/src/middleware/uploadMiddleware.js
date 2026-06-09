import multer from "multer";
import path from "path";
import fs from "fs";

// Automatically guarantee local destination directory exists on boot
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Destination folder on local hard drive
  },
  filename: (req, file, cb) => {
    // Generates unique timestamp filenames to prevent overwrites
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit safeguard
});

export default upload;
