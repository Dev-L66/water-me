import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { loginValidation } from "../../../../../backend/utils/lib/inputValidation/inputValidation";
import { z } from "zod/v4";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: login,
    error,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Logged in successfully.");
      navigate("/");
    },
    onError: (error) => {
      toast.error(`Login failed.`);
    },
  });
  const handleFormSubmit = (e) => {
    e.preventDefault();

    login(formData);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <main className="flex gap-2   min-h-screen overflow-hidden">
        <motion.figure
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="w-[40%] h-screen md:block hidden  relative"
        >
          <div>
            <img
              className="h-[50%] object-cover bg-repeat-none absolute left-0 bottom-0"
              src="l.png"
              alt="leaves"
              loading="lazy"
            />
          </div>
        </motion.figure>
        <form
          className="w-[100%] md:w-[40%] container mx-auto p-2 h-screen flex flex-col justify-center items-center"
          onSubmit={handleFormSubmit}
        >
          <div className="flex bg-transparent p-5">
            <motion.h1
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.25, ease: "easeInOut" }}
              className="text-5xl md-text-6xl font-bold font-black-ops-one flex justify-center items-center"
            >
              Water Your Plants.
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.25, ease: "easeInOut" }}
            className="bg-transparent font-caveat-brush flex flex-col justify-center items-center gap-2 p-2 text-lg "
          >
            <div className="flex flex-col justify-between items-center gap-2 ">
              <label htmlFor="username">Username:</label>
              <input
                className="bg-transparent focus:outline-none "
                placeholder="Enter your username here."
                type="text"
                name="username"
                id="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                minLength={3}
                maxLength={30}
              />
            </div>

            <div className="flex flex-col justify-between items-center gap-2">
              <label htmlFor="password">Password:</label>
              <input
                className="bg-transparent focus:outline-none w-full "
                placeholder="Enter your password here."
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                minLength={8}
                maxLength={30}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Link to="/signup">Don't have an account? Signup.</Link>
              <button
                disabled={isPending}
                className="rounded-2xl text-sm font-bold text-green-900 bg-green-300 p-3 hover:bg-green-950 hover:text-green-300 cursor-pointer"
              >
                {isPending ? "Loggin..." : "Login"}
              </button>
            </div>
          </motion.div>
          <div className="flex justify-center items-center">
            <div className="text-red-500 ">
              {isError && error?.message && (
                <p className="text-red-500 text-center">{error.message}</p>
              )}
            </div>
          </div>
        </form>
        <motion.figure
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="w-[40%] h-screen md:block hidden relative transform rotate-180 "
        >
          <div>
            <img
              className="h-[50%] object-cover bg-repeat-none absolute bottom-0 left-0 "
              src="l.png"
              alt="leaves"
              loading="lazy"
            />
          </div>
        </motion.figure>
      </main>
    </>
  );
};

export default LoginPage;
