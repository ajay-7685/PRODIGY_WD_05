import { Oval } from 'react-loader-spinner';
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function WeatherApp() {
	const [input, setInput] = useState('');
	const [weather, setWeather] = useState({
		loading: false,
		data: {},
		error: false,
	});

	// Function to format the current date
	const toDateFunction = () => {
		const months = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December',
		];
		const weekDays = [
			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
		];
		const currentDate = new Date();
		const date = `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
		return date;
	};

	// Function to fetch weather data from the API
	const fetchWeatherData = async (city) => {
		const url = 'https://api.openweathermap.org/data/2.5/weather';
		const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
		try {
			const response = await axios.get(url, {
				params: {
					q: city,
					units: 'metric',
					appid: apiKey,
				},
			});
			setWeather({ data: response.data, loading: false, error: false });
		} catch (error) {
			setWeather({ data: {}, loading: false, error: true });
			console.error('Error fetching weather data:', error);
		}
	};

	// Handler for the search input
	const handleSearch = async (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			setInput('');
			setWeather({ ...weather, loading: true });
			await fetchWeatherData(input);
		}
	};

	return (
		<div className="App">
			<h1 className="app-name">Weather App</h1>
			<div className="search-bar">
				<input
					type="text"
					className="city-search"
					placeholder="Enter City Name.."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={handleSearch}
				/>
			</div>
			{weather.loading && (
				<div className="loader">
					<Oval type="Oval" color="black" height={100} width={100} />
				</div>
			)}
			{weather.error && (
				<div className="error-message">
					<FontAwesomeIcon icon={faFrown} />
					<span style={{ fontSize: '20px' }}>City not found</span>
				</div>
			)}
			{weather.data.main && (
				<div>
					<div className="city-name">
						<h2>
							{weather.data.name}, <span>{weather.data.sys.country}</span>
						</h2>
					</div>
					<div className="date">
						<span>{toDateFunction()}</span>
					</div>
					<div className="icon-temp">
						<img
							src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
							alt={weather.data.weather[0].description}
						/>
						{Math.round(weather.data.main.temp)}
						<sup className="deg">°C</sup>
					</div>
					<div className="des-wind">
						<p>{weather.data.weather[0].description.toUpperCase()}</p>
						<p>Wind Speed: {weather.data.wind.speed} m/s</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default WeatherApp;
