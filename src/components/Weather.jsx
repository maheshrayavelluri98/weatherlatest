import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FaLocationDot, FaWind } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecastByCity } from "../redux/weatherSlice";

import sunnyImage from "../assets/sunny.jpg";
import rainImage from "../assets/rain.jpg";
import snowImage from "../assets/snow.jpg";
import cloudImage from "../assets/cloud.jpg";

function Weather() {
  const [city, setCity] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchForecastByCity("Machilipatnam"));
  }, [dispatch]);

  const forecast = useSelector((state) => state.weather.forecast);

  // Safely access forecast data
  const forecastHours =
    forecast?.forecast?.forecastday?.[0]?.hour?.slice(0, 10) || [];
  const weatherCondition =
    forecast?.current?.condition?.text?.toLowerCase() || "";

  // Determine background image based on weather condition
  let backgroundImage = sunnyImage;

  if (
    weatherCondition.includes("sunny") ||
    weatherCondition.includes("clear")
  ) {
    backgroundImage = sunnyImage;
  } else if (weatherCondition.includes("rain")) {
    backgroundImage = rainImage;
  } else if (weatherCondition.includes("snow")) {
    backgroundImage = snowImage;
  } else if (
    weatherCondition.includes("cloud") ||
    weatherCondition.includes("overcast")
  ) {
    backgroundImage = cloudImage;
  }

  const handleSearch = () => {
    if (city.trim() !== "") {
      dispatch(fetchForecastByCity(city));
    }
  };

  return (
    <div
      className="weather-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="main-section">
        <div className="weather-info">
          <div className="location">
            <h3>
              {forecast?.location?.name} - {forecast?.location?.country}
            </h3>
          </div>

          <div className="condition">
            <h1>{forecast?.current?.condition?.text}</h1>
          </div>
        </div>

        <div className="weather-hours">
          {forecastHours.map((hour, index) => {
            const time = new Date(hour.time).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            return (
              <div className="hour-card" key={index}>
                <div className="hour-time">
                  <p>{time}</p>
                </div>
                <div className="hour-condition">
                  <img src={hour.condition.icon} alt="" />
                </div>
                <div className="hour-temp">
                  <h2>{Math.ceil(hour.temp_c)}°C</h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="side-section">
        <div className="search-box">
          <FaLocationDot className="icon" />
          <input
            type="text"
            placeholder={forecast?.location?.name || "Enter city"}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <BiSearch className="icon" onClick={handleSearch} />
        </div>
        <div className="temp-info">
          <h1>{Math.ceil(forecast?.current?.temp_c || 0)}°C</h1>

          <p>
            <FaWind /> {forecast?.current?.wind_dir}{" "}
            {forecast?.current?.wind_kph} km/h
          </p>
        </div>
        <div className="forecast-days">
          <h1 className="forecast-heading">The Next Days Forecast</h1>

          {forecast?.forecast?.forecastday?.map((item, index) => {
            const forecastDate = new Date(item.date).toLocaleDateString(
              "en-GB",
              {
                weekday: "long",
                day: "2-digit",
                month: "long",
              }
            );

            return (
              <div className="forecast-item" key={index}>
                <div className="forecast-details">
                  <div className="forecast-icon">
                    <img src={item.day.condition.icon} alt="" />
                  </div>
                  <div className="details">
                    <h2>{forecastDate}</h2>
                    <p>{item.day.condition.text}</p>
                  </div>
                </div>

                <div className="forecast-temp">
                  <div className="temp-display">
                    <h2>{Math.ceil(item.day.maxtemp_c)}°C</h2>
                    <h2>{Math.ceil(item.day.mintemp_c)}°C</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Weather;
