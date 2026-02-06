import Link from "next/link";

export default function CTASection() {
    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="relative overflow-hidden rounded-3xl bg-black px-8 py-16 sm:px-16 sm:py-24">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                    {/* Gradient Orbs */}
                    <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Ready to get started?
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-gray-300">
                            Join thousands of developers who trust imagic for their image
                            optimization needs. Start free, scale as you grow.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/login"
                                className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gray-100 hover:shadow-xl hover:shadow-white/20"
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
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
                            >
                                Sign In
                            </Link>
                        </div>

                        <p className="mt-8 text-sm text-gray-400">
                            No credit card required • 1,000 free optimizations • Cancel
                            anytime
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
