import styles from "./TestimonialsSection.module.css";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Lead Developer",
    company: "TechFlow",
    content:
      "Imagic has transformed our image optimization workflow. We've reduced loading times by 70% and our customers love the faster experience.",
    avatar: "👩‍💻",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CTO",
    company: "Creative Studios",
    content:
      "The API is incredibly easy to integrate. We went from concept to production in just two days. The image quality is outstanding.",
    avatar: "👨‍💼",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Product Manager",
    company: "E-commerce Plus",
    content:
      "Our website performance improved dramatically. The automatic format selection and compression have saved us countless hours and server costs.",
    avatar: "👩‍🎨",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Frontend Engineer",
    company: "StartupX",
    content:
      "Best image optimization service we've used. The SDK is well-documented and the support team is incredibly responsive.",
    avatar: "👨‍💻",
    rating: 5,
  },
  {
    id: 5,
    name: "Anna Thompson",
    role: "Head of Engineering",
    company: "Digital Solutions",
    content:
      "Imagic's real-time optimization has been a game-changer for our mobile app. Users report much faster loading times.",
    avatar: "👩‍🔬",
    rating: 5,
  },
  {
    id: 6,
    name: "James Park",
    role: "Founder",
    company: "PhotoShare",
    content:
      "The quality of compressed images is exceptional. We've maintained visual fidelity while reducing file sizes by up to 80%.",
    avatar: "👨‍🚀",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const renderStars = (rating: number) => {
    return Array(rating)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={styles.star}>
          ⭐
        </span>
      ));
  };

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Loved by developers worldwide</h2>
          <p>
            Join thousands of developers and companies who trust Imagic to
            optimize their images and improve their applications.
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>10M+</div>
            <div className={styles.statLabel}>Images Optimized</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Happy Customers</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>99.9%</div>
            <div className={styles.statLabel}>Uptime</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Support</div>
          </div>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.rating}>
                {renderStars(testimonial.rating)}
              </div>

              <p className={styles.content}>
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className={styles.author}>
                <div className={styles.avatar}>{testimonial.avatar}</div>
                <div className={styles.authorInfo}>
                  <div className={styles.name}>{testimonial.name}</div>
                  <div className={styles.role}>
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.trustBadges}>
          <div className={styles.trustBadge}>
            <span className={styles.badgeIcon}>🔒</span>
            <div>
              <div className={styles.badgeTitle}>SOC 2 Compliant</div>
              <div className={styles.badgeDesc}>Enterprise security</div>
            </div>
          </div>
          <div className={styles.trustBadge}>
            <span className={styles.badgeIcon}>⚡</span>
            <div>
              <div className={styles.badgeTitle}>99.9% SLA</div>
              <div className={styles.badgeDesc}>Guaranteed uptime</div>
            </div>
          </div>
          <div className={styles.trustBadge}>
            <span className={styles.badgeIcon}>🌐</span>
            <div>
              <div className={styles.badgeTitle}>Global CDN</div>
              <div className={styles.badgeDesc}>Worldwide delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
