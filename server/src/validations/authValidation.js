import {z} from 'zod';


export const signUpValidate = z
    .object({
        email: z.string().email("Invalid email address."),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters long.")
            .max(20, "Password must be at most 20 characters long."),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password and Confirm Password must be the same.",
        path: ["confirmPassword"],
    });

export const signInValidate = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(1, "Password is required."),
});

export const updateProvileValidate = z.object({
    firstName: z.string().min(1, "First Name is required."),
    lastName: z.string().min(1, "Last Name is required."),
});
