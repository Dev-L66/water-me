import { z } from "zod/v4";

export const nameValidation = z
  .string()
  .max(30, { message: "Name should be less than 30 characters." })
  .min(3, { message: "Name should be atleast 3 characters." })
  .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
    message:
      "Name can only contain letters (no special characters or numbers).",
  })
  .trim();

export const usernameValidation = z
  .string()
  .max(30, { message: "Username should be less than 30 characters." })
  .min(3, { message: "Username should be atleast 3 characters." })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message:
      "Username can only contain letters, numbers, and underscores (no spaces or special characters).",
  })
  .trim();

export const emailValidation = z
  .email({ message: "Enter a valid email." })
  .max(50, { message: "Email should be less than 50 characters." })
  .min(3, { message: "Email should be atleast 3 characters." })
  .trim();

export const passwordValidation = z
  .string()
  .max(30, { message: "Password should be less than 30 characters." })
  .min(8, { message: "Password should be atleast 8 characters." })
  .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S+$/, {
    message:
      "Password must include at least one uppercase letter, one digit, one special character, and no spaces.",
  })

  .trim();

export const signupValidation = z.object({
  name: nameValidation,
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export const loginValidation = z.object({
  username: usernameValidation,
  password: passwordValidation,
});

export const createPlantValidation = z.object({
  name: nameValidation,
  lastWateredAt: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) {
      const date = new Date(val);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  }, z.date({ message: "Last watered at should be a valid date." }).optional()),
  waterFrequency: z
    .number({ message: "Water frequency should be a number." })
    .optional(),
  reminderEnabled: z.boolean().optional(),
  image: z.string().trim(),
});
