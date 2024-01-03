import Image from "next/image";
import UploadImages from "../components/UploadImg";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadImages />
    </main>
  );
}
