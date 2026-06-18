import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}${path.extname(file.originalname)}`
    );
  },
});



const fileFilter = (req, file, cb) => {
  console.log("Original Name:", file.originalname);
  console.log("Mime Type:", file.mimetype);

  // 🟢 UPGRADED: Added avif format to match your modern browser uploads
  const allowedExts = /jpg|jpeg|png|webp|jfif|heic|heif|avif/i;
  
  const ext = allowedExts.test(path.extname(file.originalname).toLowerCase());
  
  const mime = file.mimetype.startsWith("image/") || file.mimetype === "application/octet-stream";

  if (ext || mime) {
    cb(null, true);
  } else {
    cb(new Error("Images only"));
  }
};



const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
