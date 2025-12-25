import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';

describe('Button Component', () => {
    describe('Rendering', () => {
        it('renders with default props', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
        });

        it('renders with children', () => {
            render(<Button>Test Button</Button>);
            expect(screen.getByText('Test Button')).toBeInTheDocument();
        });
    });

    describe('Variants', () => {
        it('applies primary variant styles by default', () => {
            render(<Button>Primary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-indigo-600');
        });

        it('applies secondary variant styles', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('border-indigo-600');
        });

        it('applies ghost variant styles', () => {
            render(<Button variant="ghost">Ghost</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-transparent');
        });

        it('applies danger variant styles', () => {
            render(<Button variant="danger">Danger</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-red-600');
        });
    });

    describe('Sizes', () => {
        it('applies small size styles', () => {
            render(<Button size="sm">Small</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
        });

        it('applies medium size styles by default', () => {
            render(<Button>Medium</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-4', 'py-2', 'text-base');
        });

        it('applies large size styles', () => {
            render(<Button size="lg">Large</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
        });
    });

    describe('Loading State', () => {
        it('shows loading spinner when isLoading is true', () => {
            render(<Button isLoading>Loading</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
        });

        it('hides text icons when loading', () => {
            render(<Button isLoading leftIcon={<span>Icon</span>}>Loading</Button>);
            expect(screen.queryByText('Icon')).not.toBeInTheDocument();
        });
    });

    describe('Disabled State', () => {
        it('applies disabled styles when disabled', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
        });
    });

    describe('Click Events', () => {
        it('calls onClick when clicked', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('does not call onClick when disabled', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick} disabled>Click me</Button>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });

        it('does not call onClick when loading', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick} isLoading>Click me</Button>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Accessibility', () => {
        it('has focus-visible ring styles', () => {
            render(<Button>Accessible</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-offset-2');
        });

        it('forwards ref correctly', () => {
            const ref = createRef<HTMLButtonElement>();
            render(<Button ref={ref}>Ref Test</Button>);
            expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        });
    });

    describe('Icons', () => {
        it('renders left icon', () => {
            render(<Button leftIcon={<span data-testid="left-icon">L</span>}>With Icon</Button>);
            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        });

        it('renders right icon', () => {
            render(<Button rightIcon={<span data-testid="right-icon">R</span>}>With Icon</Button>);
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });
    });
});
