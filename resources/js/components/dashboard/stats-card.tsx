import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface Props {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor: string;
}

export default function StatsCard({ title, value, icon: Icon, iconColor }: Props) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold mt-2">{value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${iconColor}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
