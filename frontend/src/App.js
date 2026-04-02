import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgTemp, setAvgTemp] = useState(0);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/locations")
      .then(res => {
        setLocations(res.data.locations);
        setSelectedLocation(res.data.locations[0]);
      });
  }, []);

  useEffect(() => {
    if (!selectedLocation) return;
    setLoading(true);

    axios.get(`http://127.0.0.1:8000/forecast/${selectedLocation}`)
      .then(res => {
        const formatted = res.data.prophet.map((item) => ({
          date: new Date(item.ds).toLocaleDateString(),
          temperature: item.yhat
        }));

        setData(formatted);

        const avg = formatted.reduce((sum, d) => sum + d.temperature, 0) / formatted.length;
        setAvgTemp(avg.toFixed(1));

        setLoading(false);
      });
  }, [selectedLocation]);

  const card = {
  background: "#111827",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)"
};

  return (
  <div style={{ background: "#0b1220", color: "white", minHeight: "100vh" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1>Weather-Prediction</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              background: "#1c2435",
              padding: "10px",
              borderRadius: "8px",
              color: "white",
              border: "none"
            }}
          >
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <div style={card}>
            <p>Location</p>
            <h3>{selectedLocation}</h3>
          </div>

          <div style={card}>
            <p>Avg Temp</p>
            <h3>{avgTemp}°C</h3>
          </div>

          <div style={card}>
            <p>Status</p>
            <h3>
              {avgTemp > 30 ? "Hot" : avgTemp > 20 ? "Moderate" : "Cool"}
            </h3>
          </div>
        </div>

        <div style={card}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <CartesianGrid stroke="#2a3447" />
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#22d3ee"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  </div>
);
}