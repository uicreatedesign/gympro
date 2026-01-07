import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import FrontendNav from '@/components/FrontendNav';
import FrontendFooter from '@/components/FrontendFooter';
import { Users, Clock, CreditCard, Dumbbell, BarChart3, Lock, Zap, CheckCircle2 } from 'lucide-react';

const features = [
    {
        icon: Users,
        title: 'Member Management',
        description: 'Easily manage member profiles, track status, and maintain detailed records.',
    },
    {
        icon: Clock,
        title: 'Attendance Tracking',
        description: 'Real-time attendance monitoring with QR code check-in system.',
    },
    {
        icon: CreditCard,
        title: 'Payment & Billing',
        description: 'Automated billing, subscription management, and payment processing.',
    },
    {
        icon: Dumbbell,
        title: 'Trainer Management',
        description: 'Organize trainers, assign members, and track training sessions.',
    },
];

const roles = [
    {
        title: 'Admin',
        description: 'Full system control and configuration',
        features: ['All features', 'User management', 'Settings'],
    },
    {
        title: 'Manager',
        description: 'Gym operations and reporting',
        features: ['Member management', 'Reports', 'Billing'],
    },
    {
        title: 'Trainer',
        description: 'Member and session management',
        features: ['Member profiles', 'Attendance', 'Workouts'],
    },
    {
        title: 'Member',
        description: 'Personal fitness dashboard',
        features: ['My subscriptions', 'Attendance', 'Payments'],
    },
];

const pricing = [
    {
        name: 'Basic',
        price: '$29',
        period: '/month',
        description: 'Perfect for small gyms',
        features: ['Up to 100 members', 'Basic reporting', 'Email support'],
        popular: false,
    },
    {
        name: 'Standard',
        price: '$79',
        period: '/month',
        description: 'For growing gyms',
        features: ['Up to 500 members', 'Advanced analytics', 'Priority support', 'Payment integration'],
        popular: true,
    },
    {
        name: 'Premium',
        price: '$199',
        period: '/month',
        description: 'Enterprise solution',
        features: ['Unlimited members', 'Custom reports', '24/7 support', 'API access', 'White-label'],
        popular: false,
    },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <FrontendNav />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 md:py-24 lg:py-32 flex-1">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                            Smart Gym Management Made Simple
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                            Streamline your gym operations with our all-in-one management platform. Track members, manage subscriptions, monitor attendance, and process payments—all in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/register">
                                <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
                            </Link>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">View Demo</Button>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 aspect-square flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <BarChart3 className="h-16 w-16 mx-auto text-primary/40" />
                                <p className="text-muted-foreground">Dashboard Preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to run your gym efficiently</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={idx} className="border hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <Icon className="h-8 w-8 text-primary mb-2" />
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            <Separator />

            {/* Role-Based System Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Role-Based Access Control</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tailored dashboards for every user type</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roles.map((role, idx) => (
                        <Card key={idx} className="border">
                            <CardHeader>
                                <CardTitle>{role.title}</CardTitle>
                                <CardDescription>{role.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {role.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <Separator />

            {/* Pricing Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose the plan that fits your gym</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricing.map((plan, idx) => (
                        <Card key={idx} className={`border transition-all ${
                            plan.popular ? 'ring-2 ring-primary shadow-lg' : ''
                        }`}>
                            {plan.popular && (
                                <div className="px-6 pt-6">
                                    <Badge className="mb-4">Most Popular</Badge>
                                </div>
                            )}
                            <CardHeader className={plan.popular ? 'pt-2' : ''}>
                                <CardTitle>{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                                    Get Started
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <Separator />

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-8 md:p-12 text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Gym?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Join hundreds of gyms already using GYM Pro to streamline their operations</p>
                    <Link href="/register">
                        <Button size="lg" className="px-8">Start Managing Your Gym Today</Button>
                    </Link>
                </div>
            </section>

            <FrontendFooter />
        </div>
    );
}
