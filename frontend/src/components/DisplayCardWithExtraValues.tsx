interface DisplayCardItem {
    [key: string]: string | string[] | number | boolean | undefined;
}

interface DisplayCardWithExtraValuesProps {
    title: string;
    data: DisplayCardItem[];
    className: string;
    extraFields: string[];
    keyField?: (item: DisplayCardItem) => string;
    nameField?: string;
}

const DisplayCardWithExtraValues = ({
    title,
    data,
    className,
    extraFields,
    keyField,
    nameField = 'name'
}: DisplayCardWithExtraValuesProps) => {
    const formatFieldName = (field: string) => 
        field !== 'item' ? field.charAt(0).toUpperCase() + field.slice(1) : '';

    const renderFieldValue = (value: string | string[]) => {
        if (Array.isArray(value)) {
            return (
                <ul className="item-list">
                    {value.map((item, index) => (
                        <li key={index} className="item-entry">{item}</li>
                    ))}
                </ul>
            );
        }
        return <p>{value}</p>;
    };

    return (
        <div className="info-card">
            <h2>{title}</h2>
            {data.map((item, index) => (
                <div 
                    key={`${keyField ? keyField(item) : item[nameField]}-${index}`} 
                    className={className}
                >
                    <h3>{item[nameField]}</h3>
                    {extraFields.map((field) => 
                        item[field] && (
                            <div key={field} className="extra-field-container">
                                {field !== 'item' && <h4>{formatFieldName(field)}:</h4>}
                                {renderFieldValue(item[field] as string | string[])}
                            </div>
                        )
                    )}
                </div>
            ))}
        </div>
    );
};

export default DisplayCardWithExtraValues;