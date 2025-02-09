import { useState } from "react";
import Button from "../../components/Button/Button";
import Dropdown from "../../components/Dropdown/Dropdown";
import Input from "../../components/Input/Input";
import { useNavigate } from 'react-router-dom';
import { getCountryAndTourismData, getVolcanoAndEarthquakeData } from "../../api";
import { monthOptions } from "../../utils";
import "./HomePage.css";
import { BiSolidPlaneAlt } from "react-icons/bi";


const HomePage = () => {
    const [countryName, setCountryName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async () => {
        if (!countryName || !selectedMonth) {
            alert('Please fill in all fields');
            return;
        }

        try {
            
            const { countryData, tourismData } = await getCountryAndTourismData(countryName, selectedMonth);
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
                <h3>Prepare for your next adventure</h3>
                <div className="form-row">
                    <Input 
                        id="country-name-input"
                        name="country-name"
                        className="country-name-field"
                        type="text"
                        placeholder="Enter country name..."
                        required={true}
                        value={countryName}
                        onChange={(e) => setCountryName(e.target.value)}
                    />
                    <Dropdown 
                        id="month-select"
                        name="month"
                        className="month-field"
                        required={true}
                        options={monthOptions}
                        label="Month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                    <Button 
                        id="submit-button" 
                        className="submit-button" 
                        type="submit" 
                        onClick={handleSubmit} 
                        icon={<BiSolidPlaneAlt />}
                    />
                </div>
            </div>
        </div>
    )
}

export default HomePage;