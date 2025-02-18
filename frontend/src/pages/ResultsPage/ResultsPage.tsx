import { useLocation } from "react-router-dom";
import { CityPopulation, LanguageDetail } from "../../types";
import FactCard from "../../components/FactCard";
import DisplayCard, { DisplayCardItem } from "../../components/DisplayCard";
import { mockData } from "../../mockData";
import DisplayCardWithExtraValues from "../../components/DisplayCardWithExtraValues";
import "./ResultsPage.css";
import { monthOptions } from "../../utils";

const ResultsPage = () => {
    const location = useLocation();
    const useMockData = false;
    
    const { countryName, selectedMonth, data } = useMockData 
        ? { countryName: "France", selectedMonth: 5, data: mockData }
        : location.state || {};
    const countryData = data.countryData.data;
    const tourismData = data.tourismData.data;
    const volcanoData = data.volcanoData.data;
    const earthquakeData = data.earthquakeData[0].data;

    return (
        <main className="results-page">
            <header className="hero-section">
                <img 
                    src={countryData.countryDetails.flag} 
                    alt={`${countryName} flag`} 
                    className="country-flag"
                />
                <h1>Discover {countryName}</h1>
            </header>
            
            <section className="dashboard-grid">
                <FactCard 
                    title="Quick Facts"
                    facts={[
                        { 
                            label: "Capital City", 
                            value: countryData.countryDetails.capitalCity[0], 
                            className: "capital-city" 
                        },
                        { 
                            label: "Currency", 
                            value: (() => {
                                const currencies = countryData.countryDetails.currencies;
                                const currencyCode = Object.keys(currencies)[0];
                                const currency = currencies[currencyCode];
                                return currency ? (
                                    <>
                                        {currency.name}
                                        <span className="currency-symbol">
                                            ({currency.symbol})
                                        </span>
                                    </>
                                ) : 'N/A';
                            })()
                        },
                        { 
                            label: "Languages", 
                            value: countryData.countryDetails.languages
                                .map((lang: LanguageDetail) => lang.name)
                                .join(', '),
                            className: "languages"
                        }
                    ]}
                    className="info-card"
                />

                <FactCard 
                    title="Popular Cities"
                    facts={countryData.cityPopulations.map((city: CityPopulation) => ({
                        label: city.city,
                        value: city.population 
                            ? `Population: ${city.population.toLocaleString()}` 
                            : [],
                        className: "city-card"
                    }))}
                    className="info-card"
                />

                <FactCard 
                    title="Earthquakes Statistics"
                    facts={[
                        { 
                            label: "Total Earthquakes", 
                            value: earthquakeData.earthquakeStatistics.totalEarthquakes, 
                        },
                        { 
                            label: "Tsunami Count", 
                            value: earthquakeData.earthquakeStatistics.avgTsunamiCount
                        },
                        { 
                            label: "Average Magnitude", 
                            value: earthquakeData.earthquakeStatistics.avgMagnitude,
                        },
                        { 
                            label: `Average Percentage for ${monthOptions.find((month: { value: string }) => month.value === selectedMonth)?.label}`, 
                            value: `${earthquakeData.earthquakeStatistics.monthlyEarthquakePercentage}%`,
                        }
                    ]}  
                    className="info-card"
                />

                <DisplayCard 
                    title="Things to Do" 
                    data={(tourismData.thingsToDoList?.[0]?.item || []).map((item: string) => ({ 
                        name: item ? item : []
                    }))} 
                    className="things-to-do-list"
                    nameField="name"
                />

                {tourismData.unescoSitesList && tourismData.unescoSitesList.length > 0 && (
                    <DisplayCardWithExtraValues 
                        title="UNESCO World Heritage Sites" 
                        data={tourismData.unescoSitesList} 
                        className="unesco-sites-card"
                        nameField="site"
                        extraFields={['description']}
                        useFlipCard={true}
                    />
                )}

                {volcanoData && volcanoData.length > 0 && (
                    <DisplayCard 
                        title="Volcanoes" 
                        data={volcanoData} 
                        className="volcano-info"
                    />
                )}
            </section>
      
                <DisplayCardWithExtraValues 
                    title="Most Recent Earthquakes" 
                    data={earthquakeData.earthquakeData} 
                    className="earthquake-card"
                    extraFields={['magnitude', 'date', 'type']}
                    keyField={(item: DisplayCardItem) => `${item.name}-${item.date}`}
                    useFlipCard={false}
                />
           
        </main>
    );
};

export default ResultsPage;