import { useState } from "react";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Input from "../components/Input";
import { useNavigate } from 'react-router-dom';


// axios.get('/api/getCountryData').then((response) => {
//     console.log(response.data);
// }).catch((error) => {
//     console.error('Error fetching country data:', error);
// });
const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];
        
const HomePage = () => {
    const [countryName, setCountryName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async () => {
        if (!countryName || !selectedMonth) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            
            // Updated API call to use GET with query parameters
            const response = await fetch(`http://localhost:8080/api/getCountryData?country=${encodeURIComponent(countryName)}&month=${encodeURIComponent(selectedMonth)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log('Success:', data);
            
            // Navigate after successful data fetch
            navigate('/results', { 
                state: { 
                    countryName, 
                    selectedMonth,
                    data // Pass the API response data to results page
                } 
            });

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>

        <h1>The Destination Station</h1>
        <h3>Prepare for your next adventure</h3>
        <div className="form-container">
          <Input id="country-name-input"
          name="country-name"
          className="country-name-field"
          type="text"
          placeholder="Enter country name..."
          required={true}
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          />
          <Dropdown id="month-select"
          name="month"
          className="month-field"
          required={true}
          options={monthOptions}
          label="Month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <Button id="submit-button" className="submit-button" type="submit" onClick={handleSubmit}>Go</Button>
        </div>
    </>
    )
}

export default HomePage;