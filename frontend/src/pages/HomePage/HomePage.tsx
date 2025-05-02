import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Dropdown from "../../components/Dropdown/Dropdown";
import Input from "../../components/Input/Input";
import { useNavigate } from 'react-router-dom';
import { fetchAvailableCountries } from "../../api";
import { monthOptions } from "../../utils";
import "./HomePage.css";
import { FaPlane } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";

const HomePage = () => {
    const [countryName, setCountryName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [countriesList, setCountriesList] = useState<string[]>([]);
    const navigate = useNavigate();
 
    
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const availableCountries = await fetchAvailableCountries();
                const getCountryList = availableCountries.reduce((acc: string[], country) => {
                    acc.push(country.country);
                    return acc;
                }, []);
                setCountriesList(getCountryList);
            } catch (error) {
                console.error('Error loading countries:', error);
                alert('Failed to load available countries');
            }
        };

        loadCountries();
    }, []);

    const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCountryName(value);
        
        const filtered = value.length > 0
            ? countriesList.filter(country =>
                country.toLowerCase().includes(value.toLowerCase())
            )
            : countriesList; 
        
        setFilteredCountries(filtered);
        setShowSuggestions(true);
    };

    const handleInputFocus = () => {
        setFilteredCountries(countriesList);
        setShowSuggestions(true);
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
            navigate(`/results/${encodeURIComponent(countryName)}/${selectedMonth}`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to navigate. Please try again.');
        } 
    };
    return (
        <main className="home-page-wrapper">
            <section className="home-page-container">
                <h3>Prepare for your next adventure...</h3>
                <form className="form-row" onSubmit={(e) => e.preventDefault()}>
                    <div className="autocomplete-container">
                        <Input 
                            id="country-name-input"
                            name="country-name"
                            className="country-name-field"
                            type="search"
                            placeholder="Enter country name..."
                            required={true}
                            value={countryName}
                            onChange={handleCountryInputChange}
                            onFocus={handleInputFocus}
                        />
                        {showSuggestions && filteredCountries.length > 0 && (
                            <nav className="country-suggestions">
                                {filteredCountries.map((country, index) => (
                                    <li 
                                        key={index}
                                        onClick={() => handleCountrySelect(country)}
                                    >
                                        {country}
                                    </li>
                                ))}
                            </nav>
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
                </form>
            </section>
        </main>
    )
}

export default HomePage;