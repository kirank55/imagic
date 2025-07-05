"use server"
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// // Next.js App Router does not expose router.events, so use pathname as a dependency
// import { usePathname } from 'next/navigation';
import { getCurrentUser } from 'auth/currentUser';
import SignedInLinks from './SignedInLinks';
import SignedoutNavLinks from './SignedOutLinks';


const Navbar = async () => {

  const fullUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: false })

  // const fullUser = null
  console.log(fullUser)
  // const [loggedIn, setLoggedIn] = useState(false);
  // const pathname = usePathname();

  // const router = useRouter();
  // // Auth check function
  // const checkAuth = async () => {
  //     try {
  //         const res = await fetch('/api/profile', { cache: "no-store" });
  //         const data = await res.json();
  //         setLoggedIn(res.ok && !!data.username);
  //     } catch {
  //         setLoggedIn(false);
  //     }
  // };
  // useEffect(() => {
  //     checkAuth();
  // }, []);

  // // Listen for route changes and re-check auth

  // useEffect(() => {
  //     checkAuth();
  // }, [pathname]);


  // const handleLogout = async () => {
  //     await fetch('/api/logout', { method: 'POST' });
  //     setLoggedIn(false);
  //     router.push("/")
  // };

  return (
    <nav style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16, background: '#f8f8f8' }}>
      <Link href="/">Home</Link>

      {fullUser ? <SignedInLinks /> : 
      <SignedoutNavLinks />
}

    </nav>
  );
};

export default Navbar;
