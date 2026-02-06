import Link from "next/link";

export default function Navbar() {
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
                        href="#features"
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
                    >
                        Features
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
                    >
                        Dashboard
                    </Link>
                </div>

                {/* Auth Button */}
                <Link
                    href="/login"
                    className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg hover:shadow-black/20"
                >
                    Login
                </Link>
            </div>
        </nav>
    );
}
