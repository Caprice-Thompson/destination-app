import './Input.css';

interface InputProps {
  id?: string;
  className?: string;
  placeholder?: string;
  name?: string;
  type?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required: boolean;
}

const Input = ({
  id,
  className = '',
  placeholder = '',
  name,
  type = 'text',
  value,
  onChange,
  autoComplete = 'on',
  required,
}: InputProps) => {
  return (
    <input
      id={id}
      className={`input ${className}`}
      placeholder={placeholder}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required={required}
    />
  );
};

export default Input;