import './Button.css';

function Button({ children, variant, type, disabled, className }) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
    >
      <span className="button__text">{children}</span>
    </button>
  );
}

export default Button;
