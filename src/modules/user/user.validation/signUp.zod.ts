import * as z from 'zod';

export const signUpSchema = z.strictObject({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters'),
  fName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  lName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
});
export const reSendOtpSchema = z.strictObject({
  email: z.string().email('Please enter a valid email address'),
});
export const confirmEmailSchema = z.strictObject({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 characters'),
});
export const loginSchemaSchema = z.strictObject({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// .superRefine((data, ctx) => {
//   if (data.password !== data.cPassword) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'Passwords do not match',
//     });
//   }
// });
export type SignUpInput = z.infer<typeof signUpSchema>;
export type reSendOtpInput = z.infer<typeof reSendOtpSchema>;
export type confirmEmailInput = z.infer<typeof confirmEmailSchema>;
export type loginInput = z.infer<typeof loginSchemaSchema>;
