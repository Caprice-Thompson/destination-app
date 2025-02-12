import { useState } from "react";
import Button from "../../components/Button/Button";
import Dropdown from "../../components/Dropdown/Dropdown";
import Input from "../../components/Input/Input";
import { useNavigate } from 'react-router-dom';
import { getCountryAndTourismData, getVolcanoAndEarthquakeData } from "../../api";
import { monthOptions } from "../../utils";
import "./HomePage.css";
import { FaPlane } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";

export const countries = [
    "Spain", "France", "Japan", 
];

//Find better way to implement autocomplete
const HomePage = () => {
    const [countryName, setCountryName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCountryName(value);
        
        if (value.length > 0) {
            const filtered = countries.filter(country =>
                country.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCountries(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredCountries([]);
            setShowSuggestions(false);
        }
    };

    const handleCountrySelect = (country: string) => {
        setCountryName(country);
        setShowSuggestions(false);
    };

    //modal for error handling
    const handleSubmit = async () => {
        if (!countryName || !selectedMonth) {
            alert('Please fill in all fields');
            return;
        }

        try {
            
            const { countryData, tourismData } = await getCountryAndTourismData(countryName);
            const { volcanoData, earthquakeData } = await getVolcanoAndEarthquakeData(countryName, selectedMonth);

            navigate('/results', { 
                state: { 
                    countryName,
                    data: {
                        countryData,
                        tourismData,
                        volcanoData,
                        earthquakeData
                    }
                } 
            });

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch data. Please try again.');
        } 
    };
    return (
        <div className="home-page-wrapper">
            <div className="home-page-container">
                <h3>Prepare for your next adventure...</h3>
                <div className="form-row">
                    <div className="autocomplete-container">
                        <Input 
                            id="country-name-input"
                            name="country-name"
                            className="country-name-field"
                            type="text"
                            placeholder="Enter country name..."
                            required={true}
                            value={countryName}
                            onChange={handleCountryInputChange}
                        />
                        {showSuggestions && filteredCountries.length > 0 && (
                            <ul className="country-suggestions">
                                {filteredCountries.map((country, index) => (
                                    <li 
                                        key={index}
                                        onClick={() => handleCountrySelect(country)}
                                    >
                                        {country}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Dropdown 
                        id="month-select"
                        name="month"
                        className="month-field"
                        required={true}
                        options={monthOptions}
                        label="Month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        icon={<MdArrowDropDown />}
                    />
                    <Button 
                        id="submit-button" 
                        className="submit-button" 
                        type="submit" 
                        onClick={handleSubmit} 
                        icon={<FaPlane />}
                    />
                </div>
            </div>
        </div>
    )
}

export default HomePage;