export interface DisplayCardItem {
    [key: string]: string | string[] | number | boolean | undefined;
}

interface DisplayCardProps {
    title: string;
    data: DisplayCardItem[];
    className: string;
    nameField?: string;
}

const DisplayCard = ({
    title,
    data,
    className,
    nameField = 'name'
}: DisplayCardProps) => {
    return (
        <div className="info-card">
            <h2>{title}</h2>
            {data.map((item, index) => (
                <div 
                    key={`${item[nameField]}-${index}`} 
                    className={className}
                >
                    <h3>{item[nameField]}</h3>
                </div>
            ))}
        </div>
    );
};

export default DisplayCard;