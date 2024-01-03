"use client";
import { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";

export default function UploadImages() {
  const [src_image, setSrcImage] = useState<File | null>(null);
  const [target_img, setTargetImg] = useState<File | null>(null);
  const [result_img, setResultImg] = useState<string | null>(null);

  function create_url_source(x: File | null) {
    if (!x) return;
    const objectUrl = URL.createObjectURL(x);
    return objectUrl;
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("src_image", src_image as Blob);
      formData.append("target_img", target_img as Blob);

      const response = await fetch(`${process.env.API_URL}/api/faceswap/swap`, {
        method: "POST",
        body: formData,
      });

      console.log(response);
      response.json().then((data) => {
        console.log(data);
        setResultImg(data.output.image);
      });

      // Handle success or redirect as needed
      console.log("Upload successful!");
      //   onUploadSuccess();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="w-full mx-auto my-8">
      <div className="bg-white border border-gray-300 rounded-md shadow-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Root onSubmit={handleUpload}>
          <div
            id="upload section"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* src img */}
            <div id="src_image_section" className="mb-4 md:mb-0">
              <Form.Field typeof="file" name="src_image" id="src_image">
                <Form.Label className="text-xl font-bold mb-4">
                  Source Image
                </Form.Label>
                <Form.Control asChild type="file">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="drop-source-img"
                      className="flex flex-col items-center justify-center w-full h-32 md:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-4">
                        <svg
                          className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG, JPEG
                        </p>
                      </div>
                      <input
                        id="drop-source-img"
                        name="src_image"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          setSrcImage(e?.target?.files?.[0] ?? null);
                        }}
                      />
                    </label>
                  </div>
                </Form.Control>
                <Form.Message
                  match={(value, formData) => {
                    return true;
                  }}
                >
                  Please upload a valid image
                </Form.Message>
              </Form.Field>
            </div>
            {/* target img */}
            <div id="target_img_section" className="mb-4 md:mb-0">
              <Form.Field typeof="file" name="target_img" id="target_img">
                <Form.Label className="text-xl font-bold mb-4">
                  Target Image
                </Form.Label>
                <Form.Control asChild type="file">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="drop-target-img"
                      className="flex flex-col items-center justify-center w-full h-32 md:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-4">
                        <svg
                          className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG, JPEG
                        </p>
                      </div>
                      <input
                        id="drop-target-img"
                        name="target_img"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          setTargetImg(e?.target?.files?.[0] ?? null);
                        }}
                      />
                    </label>
                  </div>
                </Form.Control>
              </Form.Field>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="relative aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
              <p className="md:hidden text-center mb-4">
                <span className="font-semibold">Source Image</span>{" "}
              </p>
              <img
                id="src_image_preview"
                className="object-cover w-full h-full rounded"
                alt="Src Preview"
                src={create_url_source(src_image)}
              />
            </div>
            <div className="relative aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
              <p className="md:hidden text-center mb-4">
                <span className="font-semibold">Target Image</span>{" "}
              </p>
              <img
                id="target_image_preview"
                className="object-cover w-full h-full rounded"
                alt="Target Preview"
                src={create_url_source(target_img)}
              />
            </div>
          </div>

          <Form.Submit className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-full mt-5">
            Upload
          </Form.Submit>
        </Form.Root>

        <div className="mt-2">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Results</h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-lg">
              <img
                id="result_image_preview"
                className="object-cover w-full h-full transition-transform duration-300 transform-gpu hover:scale-105 rounded-lg"
                src={result_img ?? ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
