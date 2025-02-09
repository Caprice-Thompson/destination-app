import { useLocation } from "react-router-dom";
import { CityPopulation, LanguageDetail } from "../types";
import FactCard from "../components/FactCard";
import DisplayCard, { DisplayCardItem } from "../components/DisplayCard";
import { mockData } from "../mockData";
import DisplayCardWithExtraValues from "../components/DisplayCardWithExtraValues";

const ResultsPage = () => {
    const location = useLocation();
    const useMockData = true;
    
    const { countryName, data } = useMockData 
        ? { countryName: "France", data: mockData }
        : location.state || {};
    const countryData = data.countryData.data;
    const tourismData = data.tourismData.data;
    const volcanoData = data.volcanoData.data;
    const earthquakeData = data.earthquakeData[0].data;

    return (
        <div className="results-page">
            <div className="hero-section">
                <img 
                    src={countryData.countryDetails.flag} 
                    alt={`${countryName} flag`} 
                    className="country-flag"
                />
                <h1>Discover {countryName}</h1>
            </div>
            
            <div className="dashboard-grid">
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
                            value: (
                                <>
                                    {countryData.countryDetails.currencies.EUR.name} 
                                    <span className="currency-symbol">
                                        ({countryData.countryDetails.currencies.EUR.symbol})
                                    </span>
                                </>
                            )
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
                            className: "capital-city" 
                        },
                        { 
                            label: "Average Tsunami Count", 
                            value: earthquakeData.earthquakeStatistics.avgTsunamiCount
                        },
                        { 
                            label: "Average Magnitude", 
                            value: earthquakeData.earthquakeStatistics.avgMagnitude,
                            className: "languages"
                        },
                        { 
                            label: "Average Earthquakes in a Month", 
                            value: earthquakeData.earthquakeStatistics.avgEarthquakesInMonth,
                            className: "languages"
                        }
                    ]}  
                    className="info-card"
                />

                <DisplayCard 
                    title="Things to Do" 
                    data={tourismData.thingsToDoList[0].item.map((item: string) => ({ 
                        name: item 
                    }))} 
                    className="thing-to-do-card"
                    nameField="name"
                />

                <DisplayCardWithExtraValues 
                    title="UNESCO World Heritage Sites" 
                    data={tourismData.unescoSitesList} 
                    className="unesco-site-card"
                    nameField="site"
                    extraFields={['area', 'description']}
                />

                <DisplayCard 
                    title="Volcanoes" 
                    data={volcanoData} 
                    className="volcano-card"
                />

                <DisplayCardWithExtraValues 
                    title="Earthquakes" 
                    data={earthquakeData.earthquakeData} 
                    className="earthquake-card"
                    extraFields={['magnitude', 'date', 'type']}
                    keyField={(item: DisplayCardItem) => `${item.name}-${item.date}`}
                />
            </div>
        </div>
    );
};

export default ResultsPage;