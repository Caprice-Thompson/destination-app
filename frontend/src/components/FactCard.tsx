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
    <dl className="fact-item">
        <dt className={`fact-label ${className}`}>{label}</dt>
        <dd className={`fact-value ${className}`}>{value}</dd>
    </dl>
);

const FactCard = ({ title, facts, className }: FactCardProps) => {
    if (!facts.length) return null; 

    return (
        <section className={className}>
            <h2>{title}</h2>
            {facts.map((fact, index) => (
                <FactItem key={index} {...fact} />
            ))}
        </section>
    );
};

export default FactCard;