"use client";
import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { TextField } from "@radix-ui/themes";
import { read } from "fs";

interface BaseResponse {
  message: string;
}

type Swaps = {
  id: number;
  name: string | null;
  source_img: string;
  target_img: string;
  output_img_url: string;
  createdAt: string;
  updatedAt: string;
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

async function DeleteSwap(id: number) {
  try {
    if (!id) {
      throw new Error("Invalid ID provided, from client");
    }
    const data = new FormData();
    data.append("id", id.toString());
    const request = await fetch(`${process.env.API_URL}/api/faceswap/swap`, {
      method: "DELETE",
      body: data,
    });

    if (!request.ok) {
      throw new Error("Network response was not ok");
    }
    return request;
  } catch (error) {
    console.error("Error deleting swap:", error);
    throw new Error("Error deleting swap");
  }
}

async function UpdateSwap(id: number, name: string) {
  try {
    if (!id) {
      throw new Error("Invalid ID provided, from client");
    }
    const data = new FormData();
    data.append("id", id.toString());
    data.append("name", name);
    const request = await fetch(`${process.env.API_URL}/api/faceswap/swap`, {
      method: "PUT",
      body: data,
    });

    if (!request.ok) {
      throw new Error("Network response was not ok");
    }
    return request;
  } catch (error) {
    console.error("Error updating swap:", error);
    throw new Error("Error updating swap");
  }
}

interface ImageWrapperProps {
  swap: Swaps;
  deletedSwapCallback?: (id: number) => void;
  updateSwapCallback?: (id: number) => void;
}

function ImageWrapper(props: ImageWrapperProps) {
  const { swap } = props;
  const [name, setName] = useState<string | null>(swap.name);

  const [ShowedData, setShowedData] = useState([
    { display_name: "ID", value: swap.id, readonly: true },
    { display_name: "Name", value: name, readonly: false, onChange: setName },
    {
      display_name: "Output Image URLs",
      value: swap.output_img_url,
      readonly: true,
    },
    {
      display_name: "Source Image URLs",
      value: swap.source_img,
      readonly: true,
    },
    {
      display_name: "Target Image URLs",
      value: swap.target_img,
      readonly: true,
    },
    {
      display_name: "Created At",
      value: swap.updatedAt,
      readonly: true,
    },
    {
      display_name: "Updated At",
      value: swap.updatedAt,
      readonly: true,
    },
    { display_name: "Cached Days", value: swap.cached_days, readonly: true },
    {
      display_name: "Detection Threshold",
      value: swap.det_thresh,
      readonly: true,
    },
    { display_name: "Weight", value: swap.weight, readonly: true },
  ]);

  useEffect(() => {
    const newShowedData = ShowedData.map((data) => {
      if (data.display_name === "Name") {
        return { ...data, value: name ?? "" };
      }
      return data;
    });
    setShowedData(newShowedData);
  }, [name]);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild style={{ pointerEvents: "auto" }}>
        {/* id number on hover */}
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm hover:opacity-85 transition ease-in-out hover:duration-300 hover:transform hover:scale-105">
          <img
            src={swap.output_img_url}
            className="h-auto w-full max-w-full rounded-lg object-cover object-center hover:cursor-pointer hover:opacity-85 transition ease-in-out hover:duration-300 hover:transform hover:scale-105"
            alt={`Image ${swap.id}`}
          />
          {/* show id */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-foreground drop-shadow-2xl shadow-cutoff w-14 text-center absolute top-0 right-0 m-2 bg-background">
              {swap.id}
            </div>
            {swap.name && (
              <div className="text-xl font-bold text-cutoff drop-shadow-2xl shadow-cutoff w-full text-center absolute bottom-0 left-0 right-0 bg-foreground overflow-x-scroll">
                {swap.name}
              </div>
            )}
          </div>
        </div>
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
                  src={swap.output_img_url}
                  className="h-96 rounded-xl object-cover object-center shadow-sm my-4"
                  alt={`Image ${swap.id}`}
                />
              </div>
              <div id="meta_block" className="flex flex-col w-96">
                <div className="text-xl font-bold text-foreground overflow-y-scroll max-h-96 px-6">
                  {ShowedData.map((data, index) => (
                    <div key={index} className="text-base">
                      <p>{data.display_name}</p>
                      <TextField.Root className="my-0 m-0">
                        {
                          <TextField.Input
                            // defaultValue={data.value ?? StatusMSG.NULL}
                            value={data.value ?? StatusMSG.NULL}
                            onChange={(e) => {
                              setName(e.target.value);
                            }}
                            className="text-primary p-1 bg-cutoff -light shadow-sm w-full rounded-sm border-none borders overflow-x-scroll"
                            readOnly={data.readonly}
                          />
                        }
                      </TextField.Root>
                    </div>
                  ))}
                </div>
                {/* delete and save */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button
                    className="bg-primary text-cutoff py-2 px-4 rounded hover:bg-primary-dark focus:outline-none focus:bg-primary-dark hover:cursor-pointer"
                    onClick={() => {
                      UpdateSwap(swap.id, name ?? "");
                      props.updateSwapCallback?.(swap.id);
                    }}
                  >
                    Save
                  </Button>
                  <Dialog.Close
                    className="bg-primary text-cutoff py-2 px-4 rounded hover:bg-primary-dark focus:outline-none focus:bg-primary-dark hover:cursor-pointer"
                    onClick={() => {
                      DeleteSwap(swap.id);
                      props.deletedSwapCallback?.(swap.id);
                    }}
                  >
                    Delete
                  </Dialog.Close>
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
  const [refresh, setRefresh] = useState<boolean>(false);

  // use Effect to continuously fetch images
  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
    getImages();
  }, [refresh]);

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
              {
                <ImageWrapper
                  swap={image}
                  updateSwapCallback={() => {
                    setRefresh(true);
                  }}
                  deletedSwapCallback={() => {
                    setRefresh(true);
                  }}
                />
              }
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}
