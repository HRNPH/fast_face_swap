"use client";
import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { TextField } from "@radix-ui/themes";

interface BaseResponse {
  message: string;
}

type Swaps = {
  id: number;
  source_img: string;
  target_img: string;
  output_img_url: string;
  created_at: string;
  updated_at: string;
  cached_days: number;
  det_thresh: number;
  weight: number;
};

interface SwapHistoryResponse extends BaseResponse {
  swaps: Swaps[];
}

enum StatusMSG {
  "NULL" = "N/A",
}

function ImageOverlay(props: Swaps) {
  const ShowedData = [
    { display_name: "Output Image URLs", value: props.output_img_url },
    { display_name: "Source Image URLs", value: props.source_img },
    { display_name: "Target Image URLs", value: props.target_img },
    { display_name: "Created At", value: props.created_at },
    { display_name: "Updated At", value: props.updated_at },
    { display_name: "Cached Days", value: props.cached_days },
    { display_name: "Detection Threshold", value: props.det_thresh },
    { display_name: "Weight", value: props.weight },
  ];
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild style={{ pointerEvents: "auto" }}>
        <img
          src={props.output_img_url}
          className="h-auto w-full max-w-full rounded-lg object-cover object-center hover:cursor-pointer hover:opacity-85 transition ease-in-out hover:duration-300 hover:transform hover:scale-105"
          alt={`Image ${props.id}`}
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 bg-cutoff" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          <Dialog.Close
            className="absolute top-0 right-0 m-3 bg-white rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Close"
          >
            <Cross2Icon />
          </Dialog.Close>
          <div className="w-3/4 h-3/4 flex items-center justify-center bg-white rounded-lg shadow-sm max-h-full">
            {/* images  meta data*/}
            <div className="grid grid-cols-2">
              <div className="flex flex-col items-center justify-center mx-4">
                <img
                  src={props.output_img_url}
                  className="h-96 rounded-xl object-cover object-center shadow-sm my-4"
                  alt={`Image ${props.id}`}
                />
              </div>
              <div id="meta_block" className="flex flex-col w-96">
                <div className="text-xl font-bold text-foreground overflow-y-scroll max-h-96 px-6">
                  {ShowedData.map((data, index) => (
                    <div key={index} className="text-base">
                      <p>{data.display_name}</p>
                      <TextField.Root>
                        <TextField.Input
                          value={data.value ?? StatusMSG.NULL}
                          className="text-cutoff p-1 bg-foreground-light shadow-sm my-1 w-full rounded-sm border-none borders overflow-x-scroll"
                        ></TextField.Input>
                      </TextField.Root>
                    </div>
                  ))}
                </div>
                {/* delete and save */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button className="bg-primary text-cutoff py-2 px-4 rounded hover:bg-primary-dark focus:outline-none focus:bg-primary-dark hover:cursor-pointer">
                    Save
                  </Button>
                  <Button className="bg-primary text-cutoff py-2 px-4 rounded hover:bg-primary-dark focus:outline-none focus:bg-primary-dark hover:cursor-pointer">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function GeneratedPool(props: { className?: string }) {
  const [galleryImages, setGalleryImages] = useState<Swaps[]>([]);

  // use Effect to continuously fetch images
  useEffect(() => {
    getImages();
  }, []);

  // get images from api
  async function getImages() {
    try {
      const result = await fetch(`${process.env.API_URL}/api/faceswap/swap`, {
        method: "GET",
      });
      const images = (await result.json()) as SwapHistoryResponse;
      setGalleryImages(images.swaps);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }
  return (
    <>
      <div className="text-xl font-bold mb-4">
        Gallery Of
        <span className="text-primary"> {galleryImages.length} </span>
        Generated Images
      </div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4, 1500: 5 }}
        className={`w-1/2 ${props.className}`}
      >
        <Masonry className="overflow-y-scroll h-96 w-screen border-b-2">
          {galleryImages.map((image, index) => (
            <div className="object-cover m-1" key={index}>
              {ImageOverlay(image)}
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}
