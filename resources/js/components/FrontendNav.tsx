import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useState } from 'react';
import AppLogo from '../components/app-logo';

interface FrontendNavProps {
    showAuthButtons?: boolean;
}

export default function FrontendNav({ showAuthButtons = true }: FrontendNavProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <AppLogo/>
                    </Link>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/about">
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        About
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/contact">
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Contact
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Desktop Auth Buttons */}
                    {showAuthButtons ? (
                        <div className="hidden md:flex gap-3">
                            <Link href="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/" className="hidden md:block">
                            <Button variant="ghost" size="sm">Back to Home</Button>
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-3">
                        <Link href="/about" className="block py-2 text-sm hover:text-primary">
                            About
                        </Link>
                        <Link href="/contact" className="block py-2 text-sm hover:text-primary">
                            Contact
                        </Link>
                        {showAuthButtons ? (
                            <div className="flex flex-col gap-2 pt-2">
                                <Link href="/login">
                                    <Button variant="ghost" className="w-full">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        ) : (
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="w-full">Back to Home</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
