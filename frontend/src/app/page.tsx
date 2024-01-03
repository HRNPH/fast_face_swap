import Image from "next/image";
import UploadImages from "../components/UploadImg";
import GeneratedPool from "@/components/GeneratedPool";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center md:p-24 bg-background p-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Swap
          <span className="text-primary">Gals</span>
        </h1>
        <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          Yours Gallery of
          <span className="text-primary"> AI </span>
          Generated
          <span className="text-primary"> Faces Swap </span>
          Images,
          <span className="text-primary"> Easy Modification </span>
          in a few clicks.
        </p>
      </div>
      <GeneratedPool className="w-5/6 shadow-md shadow-foreground" />
      <UploadImages />
    </main>
  );
}
