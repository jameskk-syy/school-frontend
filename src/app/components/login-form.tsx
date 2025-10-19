"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import api from "@/lib/axios";
import { Spinner } from "@/components/ui/spinner";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Roles } from "@/lib/roles";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      usr: formData.email,
      pwd: formData.password,
    };

    try {
      const res = await api.post("school_app.services.rest.login", data);

      if (res.data.message.statusCode === 200) {

        toast.success(res.data.message.message || "Login successful!");
        localStorage.setItem("userData", JSON.stringify(res.data?.message))
        if (res.data?.message?.roles?.includes(Roles.ADMIN)) {
          router.push("/dashboards/admin");
        }
        else if (res.data?.message?.roles?.includes(Roles.TEACHER)) {
          router.push("/dashboards/teacher");

        } else if (res.data?.message?.roles?.includes(Roles.STUDENT)) {
          router.push("/dashboards/student");
        }
        else if (res.data?.message?.roles?.includes(Roles.PARENT)) {
          router.push("/dashboards/parent");
        }
      } else {
        toast.error(res.data.message.message || "Login failed!");
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        const backendMsg = err.response.data.message.message;
        toast.error(backendMsg || "Something went wrong");
      } else {
        toast.error("Network or server error – please try again.");
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Toaster position="top-right" />
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Username or Email</FieldLabel>
          <Input
            id="email"
            type="text"
            placeholder="m@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </Field>

        <Field>
          <Button type="submit">
            {isLoading ? (
              <Spinner className="size-6 text-purple-500" />
            ) : (
              "Login"
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-start">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
