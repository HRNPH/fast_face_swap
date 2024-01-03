import { Router, Request, Response } from "express";
import multer, { memoryStorage } from "multer";
import { Prisma, PrismaClient } from "@prisma/client";
import Replicate from "replicate";
import { json } from "express";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
import fs from "fs";
dotenv.config();

const replicateClient = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const prisma = new PrismaClient();

// Create a Multer instance with a destination folder for file uploads
const upload = multer({
  storage: memoryStorage(),
});

const router: Router = Router();
router.get("/", (req: Request, res: Response) => {
  res.send("Up and running!");
});

interface FaceSwapRequest {
  src_image: Express.Multer.File[];
  target_img: Express.Multer.File[];
}

type ReplicateReqInput = {
  target_image?: string;
  source_image?: string;
  request_id?: string;
  det_thresh?: number;
  local_target?: string; // base64
  local_source?: string; // base64
  cache_days?: number;
  weight?: number;
};

interface ReplicateResponse extends Object {
  code: number;
  image: string;
  msg: string;
  status: string;
}

type SwapBodyParamsGet = {
  det_thresh: string;
  cache_days: string;
  weight: string;
  name: string;
};

type SwapBodyParams = {
  det_thresh: number;
  cache_days: number;
  weight: number;
  name: string;
};

router.get("/swap", async (req, res) => {
  try {
    const swaps = await prisma.swapPair.findMany(); // get all swaps
    res.json({
      message: "All swaps history",
      swaps: swaps,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post(
  "/swap",
  upload.fields([
    {
      name: "src_image",
      maxCount: 1,
    },
    {
      name: "target_img",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const files: FaceSwapRequest = req.files as unknown as FaceSwapRequest;
      const src_image = await files["src_image"][0].buffer.toString("base64");
      const target_img = await files["target_img"][0].buffer.toString("base64");
      let { det_thresh, cache_days, weight } =
        req.body as Partial<SwapBodyParamsGet>;
      const config: SwapBodyParams = {
        det_thresh: Number(det_thresh),
        cache_days: Number(cache_days),
        weight: Number(weight),
        name: req.body.name,
      };
      // read buffer from file to base64
      const req_id = randomUUID();
      const base64of = {
        src_image: `data:${files["src_image"][0].mimetype};base64,${src_image}`, // base64
        target_img: `data:${files["target_img"][0].mimetype};base64,${target_img}`, // base64
      };
      const input: ReplicateReqInput = {
        request_id: req_id,
        local_source: base64of.src_image, // base64
        local_target: base64of.target_img, // base64
        det_thresh: config.det_thresh ?? 0.5,
        cache_days: config.cache_days ?? 7,
        weight: config.weight ?? 0.5,
      };

      const output: Partial<ReplicateResponse> = await replicateClient.run(
        "yan-ops/face_swap:d5900f9ebed33e7ae08a07f17e0d98b4ebc68ab9528a70462afc3899cfe23bab",
        {
          input: input,
        }
      );

      if (output.code == 200) {
        // save file on /tmp
        const fnames = {
          src_image: `${__filename
            .split("/")
            .slice(0, -3)
            .join("/")}/tmp/${req_id}_src_image.${
            files["src_image"][0].mimetype.split("/")[1]
          }`,
          target_img: `${__filename
            .split("/")
            .slice(0, -3)
            .join("/")}/tmp/${req_id}_target_img.${
            files["target_img"][0].mimetype.split("/")[1]
          }`,
        };

        // save to file, YOU SHOULD CHANGE THIS TO S3 but for now, just save to local since it's just a demo
        await fs.writeFileSync(fnames.src_image, files["src_image"][0].buffer);
        await fs.writeFileSync(
          fnames.target_img,
          files["target_img"][0].buffer
        );

        const faceSwap = await prisma.swapPair.create({
          data: {
            request_id: req_id,
            source_img: fnames.src_image,
            target_img: fnames.target_img,
            cached_days: config.cache_days ?? 10,
            output_img_url: output.image ?? "",
            det_thresh: config.det_thresh ?? 0.5,
            weight: config.weight ?? 0.5,
            name: config.name ?? "",
          },
        });
        res.json({ message: "Face swap successful!", output: output });
      } else {
        res.json({ message: "Face swap failed!", output: output });
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

interface SwapDeleteRequest {
  id: string;
  name: string;
}

router.delete("/swap", multer().none(), async (req, res) => {
  try {
    const { id } = req.body as Partial<SwapDeleteRequest>;
    if (!id) {
      res.status(400).json({ message: "Missing id!" });
    } else {
      const swap = await prisma.swapPair.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "Face swap deleted!", swap: "swap" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put("/swap", multer().none(), async (req, res) => {
  try {
    const { id, name } = req.body as Partial<SwapDeleteRequest> &
      Partial<SwapBodyParamsGet>;
    if (!id) {
      res.status(400).json({ message: "Missing id!" });
    } else {
      const swap = await prisma.swapPair.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name: name,
        },
      });
      res.json({ message: "Face swap updated!", swap: swap });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export const FaceSwapRouter: Router = router;
