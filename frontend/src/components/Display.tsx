import React, { useState } from "react";
import { fetchNaturalHazardData } from "../services/naturalHazardService";
import { NaturalHazard } from "../types";

const NaturalHazardDisplay: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [targetMonth, setTargetMonth] = useState<number>(1);
  const [data, setData] = useState<NaturalHazard | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchNaturalHazardData(location, targetMonth);
      setData(result);
    } catch (err) {
      setError(`Failed to fetch data: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Natural Hazard Data</h1>
      <div>
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Target Month:
          <input
            type="number"
            value={targetMonth}
            onChange={(e) => setTargetMonth(Number(e.target.value))}
            min="1"
            max="12"
          />
        </label>
      </div>
      <button onClick={handleFetchData} disabled={loading}>
        {loading ? "Fetching..." : "Get Data"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div>
          <h2>Earthquake Averages</h2>
          <p>Total Number of Earthquakes: {data.earthquakeAverages.totalNumberOfEqs}</p>
          <p>Average Number of Earthquakes in a Month: {data.earthquakeAverages.avgNumberOfEqsInAMonth}</p>
          <p>Average Number of Tsunamis: {data.earthquakeAverages.avgNumberOfTsunamis}</p>
          <p>Average Magnitude: {data.earthquakeAverages.avgMagnitude}</p>

          <h2>Volcanoes</h2>
          <ul>
            {data.volcano.map((volcano) => (
              <li key={volcano.name}>
                {volcano.name} - {volcano.region}, {volcano.country}
              </li>
            ))}
          </ul>

          <h2>Earthquakes</h2>
          <ul>
            {data.earthquake.map((eq) => (
              <li key={eq.name}>
                {eq.name} - Magnitude: {eq.magnitude}, Date: {eq.date}, Tsunami: {eq.tsunami}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NaturalHazardDisplay;