import Image from "next/image";
import LoginPage  from "./auth/page";

export default function Home() {
  return (
    <div className="font-sans min-h-screen  gap-16">
      <LoginPage />
    </div>
  );
}
