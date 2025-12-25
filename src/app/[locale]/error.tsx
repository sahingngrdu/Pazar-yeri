'use client';

import { useEffect } from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="text-center px-4">
                <div className="mb-8">
                    <span className="text-9xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        500
                    </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Bir şeyler yanlış gitti
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Üzgünüz, bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                </p>
                <button
                    onClick={reset}
                    className="btn btn-primary px-8 py-3"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );
}
