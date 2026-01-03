import { Link } from '@inertiajs/react';
import FrontendNav from '@/components/FrontendNav';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav showAuthButtons={false} />

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Terms of Service</h1>
                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-sm md:text-base">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Membership Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">By registering, you agree to maintain an active membership and follow all gym rules and regulations.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Payment Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">Membership fees are due on the specified date. Late payments may result in suspension of access.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Cancellation Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">Members may cancel their membership with 30 days notice. Refunds are subject to our refund policy.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">Members use gym facilities at their own risk. Gympro is not liable for injuries or loss of personal property.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
