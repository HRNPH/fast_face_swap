import { Router, Request, Response } from 'express';
import multer from 'multer';
import Replicate from "replicate";
import dotenv from 'dotenv';
dotenv.config();

const replicateClient = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Create a Multer instance with a destination folder for file uploads
const upload = multer({ dest: 'tmp/' });

const router: Router = Router();
router.get('/', (req: Request, res: Response) => {
    res.send('Up and running!');
});


interface FileUpload {
  src_image: Express.Multer.File;
  target_img: Express.Multer.File;
}

router.post('/swap', upload.array('file'), async (req, res) => {
  try {
    const files = req.files ?? [] as Express.Multer.File[];
    console.log(files);
    res.json({ message: 'File upload successful!' , files: req.files });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

export const FaceSwapRouter: Router = router;