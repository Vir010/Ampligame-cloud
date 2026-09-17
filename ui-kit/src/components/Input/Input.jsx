import './Input.css';

function Input({
  label,
  type = 'text',
  placeholder,
  hint,
  error = false,
}) {
  const fieldClassName = error
    ? 'input_field input_field-error'
    : 'input_field';

  return (
    <div className="input">
      {label && <label className="input_label">{label}</label>}
      <input
        className={fieldClassName}
        type={type}
        placeholder={placeholder}
      />
      {hint && <span className="input_hint">{hint}</span>}
    </div>
  );
}

export default Input;
