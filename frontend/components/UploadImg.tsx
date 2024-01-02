"use client";
import React, { useState } from "react";

interface UploadForm {
  srcImageFile: File | null;
  targetImageFile: File | null;
}

export default function UploadImages() {
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await fetch(`${process.env.API_URL}/api/faceswap/swap`, {
        method: "POST",
        body: formData,
      });

      // Handle success or redirect as needed
      console.log("Upload successful!");
      //   onUploadSuccess();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <form
      className="max-w-md mx-auto my-8 p-4 bg-white rounded-md shadow-md"
      id="upload-form"
      encType="multipart/form-data"
      onSubmit={handleUpload}
    >
      <label className="block text-xl font-bold mb-4">
        Upload Images {process.env.API_URL}
      </label>
      <div className="mb-4">
        <input
          type="file"
          name="src_image"
          className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="file"
          name="target_img"
          className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Upload
      </button>
    </form>
  );
}
