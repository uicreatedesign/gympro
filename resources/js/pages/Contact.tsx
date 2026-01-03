import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from '@inertiajs/react';
import FrontendNav from '@/components/FrontendNav';

export default function Contact() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav showAuthButtons={false} />

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Contact Us</h1>
                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Get in touch with our team</p>

                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-start gap-4 p-4 md:p-6 border rounded-lg hover:shadow-md transition-shadow">
                        <Mail className="h-6 w-6 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1 text-sm md:text-base">Email</h3>
                            <p className="text-sm md:text-base text-muted-foreground">info@gympro.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 md:p-6 border rounded-lg hover:shadow-md transition-shadow">
                        <Phone className="h-6 w-6 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1 text-sm md:text-base">Phone</h3>
                            <p className="text-sm md:text-base text-muted-foreground">+1 234 567 890</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 md:p-6 border rounded-lg hover:shadow-md transition-shadow">
                        <MapPin className="h-6 w-6 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1 text-sm md:text-base">Address</h3>
                            <p className="text-sm md:text-base text-muted-foreground">123 Fitness Street<br />Gym City, GC 12345</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
