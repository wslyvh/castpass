"use client";

import { useFarcasterAccount } from "@/hooks/useFarcasterAccount";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
}

export function SendEmail() {
  const user = useFarcasterAccount();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    setAlert(null);
    try {
      const name = user.data?.username || data.email.split("@")[0];
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, name }),
      });
      const result = await res.json();
      if (result.success) {
        setAlert({
          type: "success",
          message: "Email sent! Check your inbox.",
        });
        reset();
      } else {
        setAlert({
          type: "error",
          message: result.error || "Failed to send email.",
        });
      }
    } catch (e: any) {
      setAlert({
        type: "error",
        message: e?.message || "Failed to send email.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Send Email verification</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label className="form-control w-full">
          <input
            type="email"
            className={`input input-bordered w-full ${
              errors.email ? "input-error" : ""
            }`}
            placeholder="you@email.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className="text-error text-xs mt-1">
              {errors.email.message}
            </span>
          )}
        </label>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send verification email"}
        </button>
      </form>
      {alert && (
        <div className="mt-4">
          <div className={`alert alert-${alert.type}`}>
            <span>{alert.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
