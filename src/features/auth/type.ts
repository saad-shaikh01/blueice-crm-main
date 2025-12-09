import { User } from "@prisma/client";

export type AppUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
  birthDate?: string | Date | null;
  resetPasswordExpire?: string | Date | null;
  phoneNumber?: string | null;
  designation?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'NONBINARY' | null;
  suspended?: boolean | null;
  fcmTokens?: string[] | null;
};
