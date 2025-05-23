import { z } from "zod";

export const SignInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const SignUpSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userType: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "User type must be 'user' or 'admin'" }),
  }),
});


export type SignUpSchema = z.infer<typeof SignUpSchema>;
export type SignInSchema = z.infer<typeof SignInSchema>;
