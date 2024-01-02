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

router.post('/swap', upload.fields([
  {
    name: 'src_image',
    maxCount: 1
  },
  {
    name: 'target_img',
    maxCount: 1
  }
]), async (req, res) => {
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