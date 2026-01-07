import { Mail, Phone, MapPin } from 'lucide-react';
import FrontendNav from '@/components/FrontendNav';
import FrontendFooter from '@/components/FrontendFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Get in Touch</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We're here to help. Contact us with any questions or feedback.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl flex-1">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold">Contact Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <Mail className="h-6 w-6 mt-1 flex-shrink-0 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg">Email</h3>
                                    <p className="text-muted-foreground">info@gympro.com</p>
                                    <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <Phone className="h-6 w-6 mt-1 flex-shrink-0 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg">Phone</h3>
                                    <p className="text-muted-foreground">+1 234 567 890</p>
                                    <p className="text-sm text-muted-foreground mt-1">Mon-Fri, 9AM-6PM EST</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <MapPin className="h-6 w-6 mt-1 flex-shrink-0 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg">Address</h3>
                                    <p className="text-muted-foreground">123 Fitness Street</p>
                                    <p className="text-muted-foreground">Gym City, GC 12345</p>
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
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Your Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Input
                                            type="email"
                                            placeholder="Your Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <Input
                                        placeholder="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Textarea
                                        placeholder="Your Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        required
                                    />
                                    <Button type="submit" className="w-full">Send Message</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <FrontendFooter />
        </div>
    );
}
