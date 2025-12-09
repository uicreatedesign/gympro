import { useEffect } from 'react';
import { Head } from '@inertiajs/react';

interface Props {
    redirectUrl: string;
}

export default function PaymentRedirect({ redirectUrl }: Props) {
    useEffect(() => {
        window.location.href = redirectUrl;
    }, [redirectUrl]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Head title="Redirecting to Payment..." />
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg">Redirecting to payment gateway...</p>
            </div>
        </div>
    );
}
