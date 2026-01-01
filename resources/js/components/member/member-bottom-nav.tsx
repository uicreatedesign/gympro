import { Link } from '@inertiajs/react';
import { Home, Calendar, Dumbbell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Props {
    currentRoute: string;
    user: any;
}

export default function MemberBottomNav({ currentRoute, user }: Props) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const navItems = [
        { name: 'Home', href: '/member/dashboard', icon: Home },
        { name: 'Attendance', href: '/member/attendance', icon: Calendar },
        { name: 'Workout', href: '/member/plans', icon: Dumbbell },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
            <nav className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentRoute === item.href;
                    
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                                isActive 
                                    ? "text-primary" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span className="text-xs font-medium">{item.name}</span>
                        </Link>
                    );
                })}
                <Link
                    href="/settings/profile"
                    className="flex flex-col items-center justify-center flex-1 h-full gap-1"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage 
                            src={user?.profile_image ? `/storage/${user.profile_image}` : undefined} 
                            alt={user?.name} 
                        />
                        <AvatarFallback className="text-xs">
                            {getInitials(user?.name || '')}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs hidden font-medium text-muted-foreground">Profile</span>
                </Link>
            </nav>
        </div>
    );
}
