import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Skeleton, ProductCardSkeleton, CategoryCardSkeleton } from '../Skeleton';

describe('Skeleton', () => {
    it('renders with default props', () => {
        render(<Skeleton data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toBeInTheDocument();
        expect(skeleton).toHaveClass('animate-shimmer');
        expect(skeleton).toHaveClass('rounded-lg'); // default rectangular variant
    });

    it('renders text variant correctly', () => {
        render(<Skeleton variant="text" data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveClass('rounded');
    });

    it('renders circular variant correctly', () => {
        render(<Skeleton variant="circular" data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveClass('rounded-full');
    });

    it('renders rectangular variant correctly', () => {
        render(<Skeleton variant="rectangular" data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveClass('rounded-lg');
    });

    it('applies numeric width and height as pixels', () => {
        render(<Skeleton width={100} height={50} data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveStyle({ width: '100px', height: '50px' });
    });

    it('applies string width and height directly', () => {
        render(<Skeleton width="50%" height="auto" data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveStyle({ width: '50%', height: 'auto' });
    });

    it('applies custom className', () => {
        render(<Skeleton className="custom-class" data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveClass('custom-class');
    });

    it('has correct dark mode classes', () => {
        render(<Skeleton data-testid="skeleton" />);

        const skeleton = screen.getByTestId('skeleton');
        expect(skeleton).toHaveClass('bg-gray-200');
        expect(skeleton).toHaveClass('dark:bg-gray-700');
    });
});

describe('ProductCardSkeleton', () => {
    it('renders correctly', () => {
        render(<ProductCardSkeleton />);

        // Check container has correct styles
        const container = document.querySelector('.rounded-xl');
        expect(container).toBeInTheDocument();
    });

    it('contains image area skeleton', () => {
        render(<ProductCardSkeleton />);

        const imageArea = document.querySelector('.aspect-square');
        expect(imageArea).toBeInTheDocument();
    });

    it('contains circular skeleton for button', () => {
        render(<ProductCardSkeleton />);

        const circularSkeleton = document.querySelector('.rounded-full');
        expect(circularSkeleton).toBeInTheDocument();
    });
});

describe('CategoryCardSkeleton', () => {
    it('renders correctly', () => {
        render(<CategoryCardSkeleton />);

        const container = document.querySelector('.rounded-xl');
        expect(container).toBeInTheDocument();
    });

    it('contains aspect ratio skeleton', () => {
        render(<CategoryCardSkeleton />);

        const aspectRatio = document.querySelector('.aspect-\\[4\\/3\\]');
        expect(aspectRatio).toBeInTheDocument();
    });
});
