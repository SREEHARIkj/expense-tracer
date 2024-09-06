import { eq } from "drizzle-orm";
import { db } from "../../config/db_config";
import { users, type InsertUser, type SelectUser } from "../schema/users";

export const getAllUsers = (): SelectUser[] => {
  return db.select().from(users).all();
};

export const getUser = (userEmail: string) => {
  return db.select().from(users).where(eq(users.email, userEmail));
};

export const insertUser = (user: InsertUser) => {
  return db.insert(users).values(user).returning();
};
