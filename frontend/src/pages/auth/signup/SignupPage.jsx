import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import {  useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { signupValidation } from "../../../../../backend/utils/lib/inputValidation/inputValidation";
import {z} from "zod/v4";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();
  const { mutate:signup,  error, isError, isPending } = useMutation({
    mutationFn: async ({ name, username, email, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, username, email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }, 
    onSuccess: () => {
      toast.success("Signup successful.");
      navigate('/verify-email');
    },
    onError: () => { 
      toast.error("Signup failed");
    },
  });
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const result = signupValidation.safeParse(formData);
    if (!result.success) {
      const tree = z.treeifyError(result.error);
      setErrors(tree);
     
      return;
    }
    signup(formData);
    setErrors({});
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
          className="w-[30%] h-screen md:block hidden  relative"
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
          className="w-[100%] md:w-[50%] container mx-auto p-2"
          onSubmit={handleFormSubmit}
        >
          <div className="flex bg-transparent p-5">
            <motion.h1
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.25, ease: "easeInOut" }}
              className="text-5xl font-bold font-black-ops-one flex justify-center items-center p-2"
            >
              Water Your Plants.
            </motion.h1>
          </div>
          <div
            
            className="bg-transparent font-caveat-brush flex flex-col justify-center items-center gap-2 p-2 text-lg "
          >
            <div className="w-full flex flex-col justify-between items-center gap-2 ">
              <label htmlFor="name">Name:</label>
              <input
                className="bg-transparent focus:outline-none w-[80%] md:w-[60%]  p-1 "
                placeholder="Enter your name here."
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                minLength={3}
                maxLength={30}
              />
             
              {errors.properties?.name?.errors?.length > 0 && (
  <p className="text-red-500 text-xs font-roboto">
    {errors.properties.name.errors[0]}
  </p>
)}

            </div>

            <div className="flex w-full flex-col justify-between items-center gap-2 ">
              <label htmlFor="username">Username:</label>
              <input
                 className="bg-transparent focus:outline-none w-[80%] md:w-[60%] p-1  "
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
              {errors.properties?.username?.errors?.length > 0 && (
  <p className="text-red-500 text-xs font-roboto">
    {errors.properties.username.errors[0]}
  </p>
)}
            </div>

            <div className="flex w-full flex-col justify-between items-center gap-2">
              <label htmlFor="email">email:</label>
              <input
                 className="bg-transparent focus:outline-none w-[80%] md:w-[60%]  p-1  "
                placeholder="Enter your email here."
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                minLength={3}
                maxLength={50}
              />
              
            {errors.properties?.email?.errors?.length > 0 && (
  <p className="text-red-500 text-xs font-roboto">
    {errors.properties.email.errors[0]}
  </p>
)}
            </div>

            <div className="flex w-full flex-col justify-between items-center gap-2">
              <label htmlFor="password">Password:</label>
              <input
                 className="bg-transparent focus:outline-none w-[80%] md:w-[60%]  p-1  "
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
               {errors.properties?.password?.errors?.length > 0 && (
  <p className="text-red-500 text-xs font-roboto">
    {errors.properties.password.errors[0]}
  </p>
)}
            </div>

            <div className="flex flex-col justify-between items-center gap-2">
              <Link to="/login">Already have an account? Login.</Link>
              <button
                disabled={isPending}
                className="rounded-2xl text-sm font-bold text-green-900 bg-green-300 p-3 hover:bg-green-950 hover:text-green-300 cursor-pointer"
              >
                {isPending ? "Signing up..." : "Signup"}
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-red-500 text-sm font bold flex justify-center ">
              {isError ? error.message : ""}
              
            </p>
          </div>
        </form>
        <motion.figure
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="w-[30%] h-screen md:block hidden relative transform rotate-180 "
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

export default SignupPage;
