import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
                <div className="mx-auto max-w-3xl text-center">

                    {/* Heading */}
                    <h1 className="text-5xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
                        Intelligent Image{" "}
                        <span className="relative">
                            <span className="relative z-10">Optimization</span>
                            <svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 300 12"
                                fill="none"
                            >
                                <path
                                    d="M2 8C50 4 100 2 150 6C200 10 250 4 298 8"
                                    stroke="black"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="mt-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
                        Transform, compress, and deliver images at lightning speed. Our
                        real-time API automatically optimizes images for every device and
                        screen size.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/login"
                            className="group relative inline-flex items-center gap-2 rounded-lg bg-black px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-xl hover:shadow-black/20"
                        >
                            Get Started Free
                            <svg
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>

                    {/* Stats */}
                    {/* <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-100 pt-10">
                        <div>
                            <p className="text-3xl font-bold text-black sm:text-4xl">50ms</p>
                            <p className="mt-1 text-sm text-gray-500">Average Response</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-black sm:text-4xl">60%</p>
                            <p className="mt-1 text-sm text-gray-500">Size Reduction</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-black sm:text-4xl">99.9%</p>
                            <p className="mt-1 text-sm text-gray-500">Uptime SLA</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    );
}
