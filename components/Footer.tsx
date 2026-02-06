import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-[#eee]">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-8 items-center justify-center">
                    {/* Brand */}
                    <div className="md:col-span-1 mx-auto">
                        <Link href="/" className="flex items-center justify-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                                <svg
                                    className="h-4 w-4 text-white"
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
                            <span className="text-lg font-bold text-black">imagic</span>
                        </Link>
                        <p className="mt-4 max-w-md text-sm text-gray-500 text-center">
                            Intelligent image optimization for modern applications. Transform,
                            compress, and deliver images at lightning speed.
                        </p>
                    </div>

                    {/* Links */}
                    {/* <div>
                        <h4 className="mb-4 text-sm font-semibold text-black">Product</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#features"
                                    className="text-sm text-gray-500 transition-colors hover:text-black"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#pricing"
                                    className="text-sm text-gray-500 transition-colors hover:text-black"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-sm text-gray-500 transition-colors hover:text-black"
                                >
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div> */}

                    {/* <div>
                        <h4 className="mb-4 text-sm font-semibold text-black">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-500 transition-colors hover:text-black"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-500 transition-colors hover:text-black"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-gray-500 transition-colors hover:text-black"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div> */}
                </div>

                {/* Bottom */}
                <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-100 pt-8 md:flex-row">
                    <p className="text-sm text-gray-400 text-center mx-auto">
                        © {new Date().getFullYear()} imagic. All rights reserved.
                    </p>
                    {/* <div className="mt-4 flex gap-6 md:mt-0">
                        <Link
                            href="#"
                            className="text-sm text-gray-400 transition-colors hover:text-black"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-gray-400 transition-colors hover:text-black"
                        >
                            Terms of Service
                        </Link>
                    </div> */}
                </div>
            </div>
        </footer>
    );
}
