import { Link } from '@inertiajs/react';
import FrontendNav from '@/components/FrontendNav';
import FrontendFooter from '@/components/FrontendFooter';
import { CheckCircle } from 'lucide-react';

export default function About() {
    const features = [
        'Comprehensive member management',
        'Flexible subscription plans',
        'Real-time attendance tracking',
        'Payment processing integration',
        'Advanced analytics and reports',
        'Role-based access control',
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">About Gympro</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Empowering fitness centers with modern management solutions</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl flex-1">
                <div className="space-y-12">
                    {/* Mission Section */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                            Gympro is dedicated to providing a comprehensive gym management solution that helps fitness centers operate efficiently while delivering exceptional member experiences. We believe that technology should simplify operations, not complicate them.
                        </p>
                    </section>

                    {/* What We Offer Section */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">What We Offer</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Values Section */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Values</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-lg border bg-card">
                                <h3 className="font-semibold mb-2 text-lg">Innovation</h3>
                                <p className="text-sm text-muted-foreground">We continuously improve our platform with cutting-edge features and technologies.</p>
                            </div>
                            <div className="p-6 rounded-lg border bg-card">
                                <h3 className="font-semibold mb-2 text-lg">Reliability</h3>
                                <p className="text-sm text-muted-foreground">Your data is secure and our system is built for 99.9% uptime.</p>
                            </div>
                            <div className="p-6 rounded-lg border bg-card">
                                <h3 className="font-semibold mb-2 text-lg">Support</h3>
                                <p className="text-sm text-muted-foreground">Our team is committed to your success with dedicated support.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <FrontendFooter />
        </div>
    );
}
