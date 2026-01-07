import { Mail, Phone, MapPin } from 'lucide-react';
import FrontendNav from '@/components/FrontendNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function Contact() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav showAuthButtons={false} />

            {/* Banner Section */}
            <section className="bg-primary text-primary-foreground py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Get in Touch</h1>
                    <p className="mt-2 md:mt-4 text-lg md:text-xl text-primary-foreground/80">
                        We're here to help. Contact us with any questions or feedback.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl flex-1">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-semibold">Contact Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 mt-1 flex-shrink-0 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg">Email</h3>
                                    <p className="text-muted-foreground">info@gympro.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="h-6 w-6 mt-1 flex-shrink-0 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg">Phone</h3>
                                    <p className="text-muted-foreground">+1 234 567 890</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="h-6 w-6 mt-1 flex-shrink-0 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg">Address</h3>
                                    <p className="text-muted-foreground">123 Fitness Street, Gym City, GC 12345</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl md:text-3xl">Send us a Message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Input placeholder="Your Name" />
                                        <Input type="email" placeholder="Your Email" />
                                    </div>
                                    <Input placeholder="Subject" />
                                    <Textarea placeholder="Your Message" rows={5} />
                                    <Button type="submit" className="w-full">Send Message</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
