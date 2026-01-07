import { Link } from '@inertiajs/react';
import FrontendNav from '@/components/FrontendNav';
import FrontendFooter from '@/components/FrontendFooter';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Your privacy is important to us. Learn how we protect your data.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Privacy Policy</h1>
                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-sm md:text-base">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed">We collect personal information including name, email, phone number, and payment details to provide our gym management services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed">Your information is used to manage memberships, process payments, track attendance, and communicate important updates.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">We implement industry-standard security measures to protect your personal information from unauthorized access.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed">You have the right to access, update, or delete your personal information at any time by contacting us.</p>
                    </section>
                </div>
            </div>

            <FrontendFooter />
        </div>
    );
}
