import Link from 'next/link';
import { logOut } from 'auth/util/actions';

export default async function SignedInLinks() {

    return (
        <nav>
            <button onClick={async () => {
                "use server";
                await logOut();
            }} style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 4, background: '#222', color: '#fff', border: 'none', fontWeight: 600 }}>Logout</button>
            <Link href="/profile">Profile</Link>
        </nav>
    );
}