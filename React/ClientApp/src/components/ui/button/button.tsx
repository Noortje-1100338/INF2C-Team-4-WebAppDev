import React from 'react';
import './button.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    children: React.ReactNode;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    children,
    type = 'button',
    className = "",
    disabled = false,
    ...rest
}) => {
    const classes = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'btn-full-width' : '',
        className,
    ]
    .filter(Boolean)
    .join(' ');

    return (
        <button className={classes} type={type} disabled={disabled || loading} aria-busy={loading}  {...rest}>
            {loading && <span className="btn-spinner" aria-hidden="true" />}
            {children}
        </button>
    );
}

export default Button;