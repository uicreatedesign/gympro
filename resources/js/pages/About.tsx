import { Link } from '@inertiajs/react';
import FrontendNav from '@/components/FrontendNav';

export default function About() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav showAuthButtons={false} />

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">About Us</h1>

                <div className="space-y-6 text-sm md:text-base">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">Gympro is dedicated to providing a comprehensive gym management solution that helps fitness centers operate efficiently while delivering exceptional member experiences.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">What We Offer</h2>
                        <p className="text-muted-foreground leading-relaxed">Our platform includes member management, subscription tracking, attendance monitoring, payment processing, and detailed analytics to help gym owners make informed decisions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Our Values</h2>
                        <p className="text-muted-foreground leading-relaxed">We believe in innovation, reliability, and customer satisfaction. Our team is committed to continuous improvement and supporting the fitness community.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
