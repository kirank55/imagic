"use client"
import Link from 'next/link';
// import { getCurrentUser } from "auth/currentUser";


// This is a Next.js Server Component (no 'use client' directive)
export default function NavLinks() {

    const fullUser = null
    // const fullUser = await getCurrentUser({ withFullUser: true,redirectIfNotFound:false })



    return (
        <nav>
            {fullUser ?
                (<>
                    {/* <button onClick={async () => await logOut()} style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 4, background: '#222', color: '#fff', border: 'none', fontWeight: 600 }}>Logout</button> */}
                    <Link href="/profile">Profile</Link>
                </>)

                : (<>
                <Link  style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 4, background: '#222', color: '#fff', border: 'none', fontWeight: 600 }} href="/login">Login</Link>
                <Link  style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 4, background: '#222', color: '#fff', border: 'none', fontWeight: 600 }} href="/signup">Sign Up</Link></>)
            }

        </nav>
    );
}