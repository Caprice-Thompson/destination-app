type FactItem = {
    label: string;
    value: string | JSX.Element;
    className?: string;
};

type FactCardProps = {
    title: string;
    facts: FactItem[];
    className?: string;
};

const FactItem = ({ label, value, className }: FactItem) => (
    <div className="fact-item">
        <span className={`fact-label ${className}`}>{label}</span>
        <span className={`fact-value ${className}`}>{value}</span>
    </div>
);

const FactCard = ({ title, facts, className }: FactCardProps) => {
    if (!facts.length) return null; 

    return (
        <div className={className}>
            <h2>{title}</h2>
            {facts.map((fact, index) => (
                <FactItem key={index} {...fact} />
            ))}
        </div>
    );
};

export default FactCard;