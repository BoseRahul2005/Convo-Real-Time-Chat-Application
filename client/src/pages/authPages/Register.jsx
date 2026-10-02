import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../api/axios.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// Another webhook test

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const nameValue = watch("name");
  const usernameValue = watch("username");
  const emailValue = watch("email");

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/register", data);
      if (res.data.success) {
        toast.success(res.data.message || "Registered successfully!");
        navigate("/home");
      } else {
        toast.error(res.data.message || "Registration failed");
        reset({
          name: data.name,
          username: data.username,
          email: data.email,
          password: "",
        });
      }
    } catch (err) {
      console.error("Network or Server error:", err);
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
      reset({
        name: data.name,
        username: data.username,
        email: data.email,
        password: "",
      });
    }
  };

  return (
    <>
      <div className="min-h-dvh w-full flex items-center justify-center bg-gradient-to-tr from-black via-indigo-950 to-fuchsia-950 relative p-4">
        {/* Top Left Full Logo Header */}
        <div
          className="absolute top-2 left-4 sm:top-1 sm:left-8 z-10 flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/convo-fullLogo.svg"
            alt="Convo Logo"
            className="h-16 sm:h-28 w-auto object-contain drop-shadow-[0_0_20px_rgba(236,200,221,0.4)] transition-all hover:scale-105"
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full sm:w-87.5 max-w-sm text-center bg-white/6 border border-white/10 rounded-2xl px-6 sm:px-8 py-6"
        >
          <h1 className="text-white text-3xl mt-2 font-medium">Sign up</h1>

          <p className="text-gray-400 text-sm mt-2">
            Create an account to start a convo now!
          </p>

          <div className="mt-6">
            <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-white/60 shrink-0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <circle cx="12" cy="8" r="5" />{" "}
                <path d="M20 21a8 8 0 0 0-16 0" />{" "}
              </svg>
              <input
                type="text"
                placeholder="Name"
                autoComplete="name"
                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {nameValue && (
                <button
                  type="button"
                  onClick={() => setValue("name", "")}
                  className="text-white/50 hover:text-white transition cursor-pointer p-1 shrink-0"
                  title="Clear name"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs text-left pl-4 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-white/60 shrink-0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />{" "}
                <circle cx="12" cy="7" r="4" />{" "}
              </svg>
              <input
                type="text"
                placeholder="Username"
                autoComplete="username"
                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {usernameValue && (
                <button
                  type="button"
                  onClick={() => setValue("username", "")}
                  className="text-white/50 hover:text-white transition cursor-pointer p-1 shrink-0"
                  title="Clear username"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            {errors.username && (
              <p className="text-red-400 text-xs text-left pl-4 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-white/60 shrink-0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />{" "}
                <rect x="2" y="4" width="20" height="16" rx="2" />{" "}
              </svg>
              <input
                type="email"
                placeholder="Email id"
                autoComplete="email"
                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {emailValue && (
                <button
                  type="button"
                  onClick={() => setValue("email", "")}
                  className="text-white/50 hover:text-white transition cursor-pointer p-1 shrink-0"
                  title="Clear email"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs text-left pl-4 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-white/60 shrink-0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />{" "}
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />{" "}
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-white/50 hover:text-white transition cursor-pointer p-1 shrink-0"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs text-left pl-4 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex space-x-1 items-center justify-center h-5">
                {/* 3 bouncing dots with staggered delays */}
                <div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce"></div>
              </div>
            ) : (
              "Sign up"
            )}
          </button>

          <p
            onClick={() => navigate("/")}
            className="text-gray-400 text-sm mt-3 mb-6 cursor-pointer"
          >
            Already have an account?
            <span className="text-indigo-400 hover:underline ml-1">
              click here
            </span>
          </p>
        </form>
      </div>
      {/* Soft Backdrop*/}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-245 h-115 bg-linear-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-12 bottom-10 w-105 h-55 bg-linear-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
      </div>
    </>
  );
};

export default Register;
