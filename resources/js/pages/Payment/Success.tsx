import { Head } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
    return (
        <>
            <Head title="Payment Success" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
                    <a
                        href="/dashboard"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </>
    );
}