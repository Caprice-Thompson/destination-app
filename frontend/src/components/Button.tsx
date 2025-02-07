interface ButtonProps {
    id: string;
    className: string;
    type: 'submit';
    onClick: () => void;
    children: React.ReactNode;
}
 const Button = ({id, className, type, onClick, children}: ButtonProps) => {
    return (
        <button id={id} className={className} type={type} onClick={onClick}>
            {children}
        </button>
    )
 }

 export default Button;