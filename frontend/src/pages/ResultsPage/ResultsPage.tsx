import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CityPopulation, LanguageDetail } from "../../types";
import FactCard from "../../components/FactCard";
import DisplayCard, { DisplayCardItem } from "../../components/DisplayCard";
import DisplayCardWithExtraValues from "../../components/DisplayCardWithExtraValues";
import "./ResultsPage.css";
import { monthOptions } from "../../utils";
import { getCountryAndTourismData, getVolcanoAndEarthquakeData } from "../../api";
import { mockData } from "../../mockData";

const ResultsPage = () => {
    const { countryName, month } = useParams();
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const useMockData = true;
    useEffect(() => {
        const fetchData = async () => {
            if (!countryName || !month) {
                setError("Missing required parameters");
                setLoading(false);
                return;
            }

            try {
                if(useMockData){
                    setData(mockData);
                }else{
                    setLoading(true);
                    const { countryData, tourismData } = await getCountryAndTourismData(countryName);
                    const { volcanoData, earthquakeData } = await getVolcanoAndEarthquakeData(countryName, month);
                    
                    setData({
                        countryData,
                        tourismData,
                        volcanoData,
                        earthquakeData
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError("Failed to load data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [countryName, month, useMockData]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <button onClick={() => navigate('/')}>Return</button>
            </div>
        );
    }

    if (!data) {
        return null;
    }

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
                            label: `Average Percentage for ${monthOptions.find((m: { value: string }) => m.value === month)?.label}`, 
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