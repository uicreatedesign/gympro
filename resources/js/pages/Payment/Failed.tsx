import { Head } from '@inertiajs/react';
import { XCircle } from 'lucide-react';

export default function PaymentFailed() {
    return (
        <>
            <Head title="Payment Failed" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                    <p className="text-gray-600 mb-6">There was an issue processing your payment. Please try again.</p>
                    <a
                        href="/member/plans"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Try Again
                    </a>
                </div>
            </div>
        </>
    );
}