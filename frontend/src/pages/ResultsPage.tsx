import { useLocation } from "react-router-dom";

const ResultsPage = () => {
    const location = useLocation();
    const { countryName, data } = location.state;
    const countryData = data;
    console.log(countryData);
    return (
        <div>
          <h1>Results for {countryName}</h1>
            <h2>Country Information</h2>
            <div className="country-info">
                <p>Capital: {countryData.countryDetails.capitalCity[0]}</p>
                <p>Flag: <img src={countryData.countryDetails.flag} alt={`${countryName} flag`} style={{ width: '50px' }} /></p>
                <p>Currency: {Object.keys(countryData.countryDetails.currencies)[0]}</p>
            </div>

            <h2>City Populations</h2>

        </div>
    );
};

export default ResultsPage;