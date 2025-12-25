'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'filled';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            variant = 'default',
            className,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

        const baseStyles = `
      w-full rounded-lg transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
      disabled:cursor-not-allowed disabled:opacity-50
    `;

        const variants = {
            default: `
        border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-white
        placeholder:text-gray-500 dark:placeholder:text-gray-400
        hover:border-gray-400 dark:hover:border-gray-500
      `,
            filled: `
        border-0 border-b-2 border-gray-300 dark:border-gray-600
        bg-gray-100 dark:bg-gray-900
        text-gray-900 dark:text-white
        placeholder:text-gray-500 dark:placeholder:text-gray-400
        hover:bg-gray-200 dark:hover:bg-gray-800
        rounded-b-none
      `,
        };

        const errorStyles = error
            ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
            : '';

        const paddingStyles = clsx(
            'py-2.5',
            leftIcon ? 'pl-10' : 'pl-4',
            rightIcon ? 'pr-10' : 'pr-4'
        );

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={clsx(
                            baseStyles,
                            variants[variant],
                            errorStyles,
                            paddingStyles,
                            className
                        )}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        {...props}
                    />

                    {rightIcon && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </span>
                    )}
                </div>

                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-1.5 text-sm text-red-500"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
