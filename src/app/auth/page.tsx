"use client"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "../components/login-form"
import "../../app/auth/style.css";
import { useEffect } from "react";


export default function LoginPage() {
  useEffect(() => {
   localStorage.removeItem("userData");
  }, []);
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2  font-bold">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            School Management System.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted right relative hidden lg:block">
      </div>
    </div>
  )
}
