import multer from "multer";
import path from "path";
import fs from "fs";

const baseUploadDirectory = path.join(process.cwd(), "uploads");
const docUploadDirectory = path.join(process.cwd(), "uploads", "documents");

if (!fs.existsSync(baseUploadDirectory)) {
  fs.mkdirSync(baseUploadDirectory, { recursive: true });
}
if (!fs.existsSync(docUploadDirectory)) {
  fs.mkdirSync(docUploadDirectory, { recursive: true });
}

const imageStorageConfig = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const documentStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, docUploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageFileFilter = (req, file, cb) => {
  const allowedExts = /jpg|jpeg|png|webp|jfif|heic|heif|avif/i;
  const ext = allowedExts.test(path.extname(file.originalname).toLowerCase());
  const mime = file.mimetype.startsWith("image/") || file.mimetype === "application/octet-stream";

  if (ext || mime) {
    cb(null, true);
  } else {
    cb(new Error("Images only"));
  }
};

const documentFileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
  const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "application/octet-stream"];
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isExtensionValid = allowedExtensions.includes(ext);
  const isMimeValid = allowedMimeTypes.includes(file.mimetype);
  
  if (isExtensionValid || isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Rejection: The Document Vault strictly supports PDF and standard image files only."));
  }
};

const upload = multer({
  storage: imageStorageConfig,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadDocument = multer({
  storage: documentStorageConfig,
  fileFilter: documentFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }
});

export default upload;
