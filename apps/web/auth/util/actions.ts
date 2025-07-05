


// export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
//   const { success, data } = signUpSchema.safeParse(unsafeData)

import { destroyUserSession } from "auth/session"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

//   if (!success) return "Unable to create account"

//   const existingUser = await db.query.UserTable.findFirst({
//     where: eq(UserTable.email, data.email),
//   })

//   if (existingUser != null) return "Account already exists for this email"

//   try {
//     const salt = generateSalt()
//     const hashedPassword = await hashPassword(data.password, salt)

//     const [user] = await db
//       .insert(UserTable)
//       .values({
//         name: data.name,
//         email: data.email,
//         password: hashedPassword,
//         salt,
//       })
//       .returning({ id: UserTable.id, role: UserTable.role })

//     if (user == null) return "Unable to create account"
//     await createUserSession(user, await cookies())
//   } catch {
//     return "Unable to create account"
//   }

//   redirect("/")
// }

export async function logOut() {
  await destroyUserSession(await cookies())
  redirect("/")
}