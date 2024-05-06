import express from "express"
import uploadFileToS3 from "../controller/UploadController.js";

import multer from 'multer';
const upload = multer();

const router = express.Router();

router.post('/', upload.single('file'), uploadFileToS3);

export default router