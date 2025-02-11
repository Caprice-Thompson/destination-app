import "./Button.css";

interface ButtonProps {
    id: string;
    className: string;
    type: 'submit';
    onClick: () => void;
    children?: React.ReactNode;
    icon?: React.ReactNode;
}
 const Button = ({id, className, type, onClick, children, icon}: ButtonProps) => {
    return (
        <button id={id} className={className} type={type} onClick={onClick}>
        {icon && <span className="btn-icon">{icon}</span>}
            {children}
        </button>
    )
 }

 export default Button;