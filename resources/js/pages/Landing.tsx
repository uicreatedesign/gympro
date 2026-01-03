import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from '@inertiajs/react';
import FrontendNav from '@/components/FrontendNav';
import AppLogo from '../components/app-logo';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav />

            {/* Banner */}
            <section className="container mx-auto px-4 py-12 md:py-20 lg:py-28 text-center flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                    Transform Your Fitness Journey
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                    Complete gym management system with member tracking, subscriptions, attendance, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                    <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto">Join Now</Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">Member Login</Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t mt-auto">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <div>
                            <AppLogo/>
                            <p className="text-sm text-muted-foreground">Your complete gym management solution</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                                <li><Link href="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 flex-shrink-0" /> <span>info@gympro.com</span></li>
                                <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 flex-shrink-0" /> <span>+1 234 567 890</span></li>
                                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" /> <span>123 Fitness St</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t pt-6 text-center text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} Gympro. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
