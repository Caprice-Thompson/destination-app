import { useLocation } from "react-router-dom";
import { CityPopulation, LanguageDetail, ThingsToDo, UNESCOSite } from "../types";

const ResultsPage = () => {
    const location = useLocation();
    const { countryName, data } = location.state || {};
    const countryData = data.countryData.data;
    const tourismData = data.tourismData.data;
    console.log(tourismData);
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
                <div className="info-card">
                    <h2>Quick Facts</h2>
                    <div className="fact-item">
                        <span className="fact-label">Capital City</span>
                        <span className="fact-value">{countryData.countryDetails.capitalCity[0]}</span>
                    </div>
                    <div className="fact-item">
                        <span className="fact-label">Currency</span>
                        <span className="fact-value">
                            {countryData.countryDetails.currencies.EUR.name} 
                            <span className="currency-symbol">({countryData.countryDetails.currencies.EUR.symbol})</span>
                        </span>
                    </div>
                    <div className="fact-item">
                        <span className="fact-label">Languages</span>
                        <span className="fact-value">
                            {countryData.countryDetails.languages.map((language: LanguageDetail) => language.name).join(', ')}
                        </span>
                    </div>
                </div>

                <div className="info-card">
                    <h2>Popular Cities</h2>
                    <div className="cities-grid">
                        {countryData.cityPopulations.map((city: CityPopulation) => (
                            <div key={city.city} className="city-card">
                                {city.city}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="info-card">
                    <h2>Things to do</h2>
                    <div className="things-to-do-grid">
                        {tourismData.thingsToDoList.map((thing: ThingsToDo, index: number) => (
                            <div key={index} className="thing-to-do-card">
                                {thing.location}
                                {thing.item.map((item: string, index: number) => (
                                    <div key={index}>{item}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="info-card">
                    <h2>UNESCO World Heritage Sites</h2>
                    <div className="unesco-sites-grid">
                        {tourismData.unescoSitesList.map((site: UNESCOSite) => (
                            <div key={site.site} className="unesco-site-card">
                                <h3>{site.site}</h3>
                                <p>{site.area}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;