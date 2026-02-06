"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
                        <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-black">imagic</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden items-center gap-8 md:flex">
                    <Link
                        href="/#features"
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
                    >
                        Features
                    </Link>
                    <Link
                        href="/#pricing"
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
                    >
                        Pricing
                    </Link>
                    {session && (
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                {/* Auth Button or User Menu */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 rounded-full ring-2 ring-gray-100 transition-all hover:ring-gray-200"
                            >
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        width={36}
                                        height={36}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                        {session.user?.name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black/5">
                                    <div className="px-3 py-2">
                                        <p className="text-xs font-medium text-gray-500">Signed in as</p>
                                        <p className="truncate text-sm font-semibold text-gray-900">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg hover:shadow-black/20"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
