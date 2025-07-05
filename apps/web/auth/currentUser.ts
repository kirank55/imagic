import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

import { getUserFromSession } from "./session";
import connectDB from "database/db";
import User from "database/models/user";
import { UserDetailsForCookieType } from "types/userTypes";

type FullUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDb>>,
  undefined | null
>;

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound: true;
}): Promise<FullUser>;
function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound?: false;
}): Promise<FullUser | null>;

function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound: true;
}): Promise<User>;

function _getCurrentUser(options?: {
  withFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<User | null>;

async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const user = await getUserFromSession(await cookies());

  if (user == null) {
    if (redirectIfNotFound) return redirect("/login");
    return null;
  }

  if (withFullUser) {
    const fullUser = await getUserFromDb(user.userId);
    // This should never happen
    if (fullUser == null) throw new Error("User not found in database");
    return fullUser;
  }

  return user;
}

export const getCurrentUser = cache(_getCurrentUser);

async function getUserFromDb(id: string) {
  await connectDB();

  const rawUser = await User.findById(id);

  if (rawUser == null) return null;

  const UserDetailsForCookie = {
    username: rawUser.username,
    userId: (rawUser._id as string).toString(),
  } as UserDetailsForCookieType;

  return UserDetailsForCookie;
}
