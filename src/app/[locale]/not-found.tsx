import { Link } from '@/i18n/navigation';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="text-center px-4">
                <div className="mb-8">
                    <span className="text-9xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        404
                    </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Sayfa Bulunamadı
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                </p>
                <Link
                    href="/"
                    className="btn btn-primary px-8 py-3"
                >
                    Ana Sayfaya Dön
                </Link>
            </div>
        </div>
    );
}
