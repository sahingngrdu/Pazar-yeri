import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
    size?: 'sm' | 'md' | 'lg';
}

export function CategoryCard({ category, size = 'md' }: CategoryCardProps) {
    const sizes = {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const iconSizes = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
    };

    const imageSizes = {
        sm: 48,
        md: 64,
        lg: 80,
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    return (
        <Link
            href={`/categories/${category.slug}`}
            className={`
        group block ${sizes[size]} bg-white dark:bg-gray-800 
        rounded-xl shadow-sm hover:shadow-lg 
        transition-all duration-300 text-center
        border border-gray-100 dark:border-gray-700
        hover:border-indigo-200 dark:hover:border-indigo-800
      `}
        >
            <div
                className={`
          ${iconSizes[size]} mx-auto mb-3 rounded-full 
          overflow-hidden
          group-hover:scale-110 transition-transform duration-300
        `}
            >
                {category.imageUrl ? (
                    <Image
                        src={category.imageUrl}
                        alt={category.name}
                        width={imageSizes[size]}
                        height={imageSizes[size]}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <h3
                className={`
          font-medium text-gray-900 dark:text-white ${textSizes[size]}
          group-hover:text-indigo-600 dark:group-hover:text-indigo-400 
          transition-colors
        `}
            >
                {category.name}
            </h3>

            {category.children && category.children.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {category.children.length} alt kategori
                </p>
            )}
        </Link>
    );
}
