import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) => (
  <button className={`btn btn-${variant} ${className}`} {...props}>
    {children}
  </button>
);
