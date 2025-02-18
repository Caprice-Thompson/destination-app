import  { useState } from 'react';
import FlipCard from './FlipCard/FlipCard';

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
    useFlipCard?: boolean;
}

const DisplayCardWithExtraValues = ({
    title,
    data,
    className,
    extraFields,
    keyField,
    nameField = 'name',
    useFlipCard = false,
}: DisplayCardWithExtraValuesProps) => {
    const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});

    const handleCardClick = (itemKey: string) => {
        setFlippedCards(prev => ({
            ...prev,
            [itemKey]: !prev[itemKey]
        }));
    };

    // const formatFieldName = (field: string) => 
    //     field !== 'item' ? field.charAt(0).toUpperCase() + field.slice(1) : '';

    // const renderFieldValue = (value: string | string[]) => {
    //     if (Array.isArray(value)) {
    //         return (
    //             <ul className="item-list">
    //                 {value.map((item, index) => (
    //                     <li key={index} className="item-entry">{item}</li>
    //                 ))}
    //             </ul>
    //         );
    //     }
    //     return <p>{value}</p>;
    // };

    return (
        <div className="display-card-extra-values">
            <h2>{title}</h2>
            {data.map((item, index) => {
                const itemKey = `${keyField ? keyField(item) : item[nameField]}-${index}`;
                const hasDescription = item.description && String(item.description).trim();
                
                if (useFlipCard && hasDescription) {
                    return (
                        <FlipCard
                            key={itemKey}
                            className={className}
                            frontContent={<h3>{item[nameField]}</h3>}
                            backContent={<p>{item.description}</p>}
                            isFlipped={flippedCards[itemKey]}
                            onClick={() => handleCardClick(itemKey)}
                        />
                    );
                }

                return (
                    <div key={itemKey} className={className}>
                        <h3>{item[nameField]}</h3>
                        {hasDescription && <p>{item.description}</p>}
                        {extraFields.map(field => {
                            if (field !== nameField && field !== 'description' && item[field]) {
                                return (
                                    <dl key={field} className="extra-field-container">
                                        <dt className="field-label">{field}:</dt>
                                        <dd className="field-value">{item[field]}</dd>
                                    </dl>
                                );
                            }
                            return null;
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default DisplayCardWithExtraValues;