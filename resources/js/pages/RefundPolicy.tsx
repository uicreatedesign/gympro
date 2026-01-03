import { Link } from '@inertiajs/react';
import FrontendNav from '@/components/FrontendNav';

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav showAuthButtons={false} />

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Refund Policy</h1>
                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-sm md:text-base">
                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Refund Eligibility</h2>
                        <p className="text-muted-foreground leading-relaxed">Refunds are available within 7 days of purchase for unused memberships only.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Processing Time</h2>
                        <p className="text-muted-foreground leading-relaxed">Approved refunds will be processed within 7-10 business days to the original payment method.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">Non-Refundable Items</h2>
                        <p className="text-muted-foreground leading-relaxed">Admission fees, personal training sessions, and promotional memberships are non-refundable.</p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-semibold mb-3">How to Request</h2>
                        <p className="text-muted-foreground leading-relaxed">Contact our support team at info@gympro.com with your membership details to request a refund.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
