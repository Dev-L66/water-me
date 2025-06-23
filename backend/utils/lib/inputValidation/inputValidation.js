import { z } from "zod/v4";

export const signupValdation = z.object({
  name: z
    .string()
    .max(30, { message: "Name should be less than 30 characters." })
    .min(3, { message: "Name should be atleast 3 characters." })
   .regex(/^[A-Za-z]+$/, {
      message: "Name can only contain letters (no spaces or special characters).",
    })
    .trim(),
  username: z
    .string()
    .max(30, { message: "Username should be less than 30 characters." })
    .min(3, { message: "Username should be atleast 3 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Username can only contain letters, numbers, and underscores (no spaces or special characters).",
    })
    .trim(),
  email: z
    .email({ message: "Enter a valid email." })
    .max(50, { message: "Email should be less than 50 characters." })
    .min(3, { message: "Email should be atleast 3 characters." })
    .trim(),
  password: z
    .string()
    .max(30, { message: "Password should be less than 30 characters." })
    .min(6, { message: "Password should be atleast 6 characters." })
    .trim(),
});

export const loginValidation = z.object({
  username: z
    .string()
    .max(30, { message: "Username should be less than 30 characters." })
    .min(3, { message: "Username should be atleast 3 characters." })
     .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Username can only contain letters, numbers, and underscores (no spaces or special characters).",
    })
    .trim(),
  password: z
    .string()
    .max(30, { message: "Password should be less than 30 characters." })
    .min(6, { message: "Password should be atleast 6 characters." })
    .trim(),
});
