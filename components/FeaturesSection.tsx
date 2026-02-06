const features = [
    {
        icon: (
            <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
            </svg>
        ),
        title: "Simple and Powerful API",
        description:
            "Integrate in minutes with our RESTful API. Just append parameters to your image URLs for instant transformations.",
    },
    {
        icon: (
            <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                />
            </svg>
        ),
        title: "Automatic Performance Optimization",
        description:
            "Smart compression algorithms reduce file sizes by up to 80% while maintaining visual quality. No manual tuning required.",
    },
    {
        icon: (
            <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
            </svg>
        ),
        title: "Real-time Transformations",
        description:
            "Resize, crop, rotate, and convert formats on-the-fly. Serve WebP to supported browsers automatically.",
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="bg-gray-50 py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                        Everything you need for image optimization
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Built for developers who want powerful image handling without the
                        complexity.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
                        >
                            {/* Icon */}
                            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white transition-transform group-hover:scale-110">
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-black">
                                {feature.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-gray-600">
                                {feature.description}
                            </p>

                            {/* Hover Arrow */}
                            {/* <div className="mt-5 flex items-center text-sm font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
                                Learn more
                                <svg
                                    className="ml-1 h-4 w-4"
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
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
