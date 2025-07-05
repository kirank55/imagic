"use server"
import Link from 'next/link';

export default async function SignedoutNavLinks() {

    return (
        <nav>
                <Link  style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 4, background: '#222', color: '#fff', border: 'none', fontWeight: 600 }} href="/login">Login</Link>
                <Link  style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 4, background: '#222', color: '#fff', border: 'none', fontWeight: 600 }} href="/signup">Sign Up</Link>
        </nav>
    );
}