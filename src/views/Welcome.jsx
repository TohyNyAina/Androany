import React, { useState } from 'react';
import axios from 'axios';

const Welcome = () => {
    const [location, setLocation] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    
    const handleLocationInput = (e) => {
        setLocation(e.target.value);
    };

    const handleWeatherFetch = async () => {
        try {
            const apiKey = 'ee5e0f4ea27e4f45b00160822242208'; // Remplacez par votre clé API de l'API météo
            const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`);
            setWeather(response.data);
            setError('');
        } catch (error) {
            setError('Impossible de récupérer la météo. Vérifiez votre entrée ou les autorisations GPS.');
        }
    };

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const apiKey = 'ee5e0f4ea27e4f45b00160822242208'; // Remplacez par votre clé API de l'API météo
                    const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=1`);
                    setWeather(response.data);
                    setError('');
                } catch (error) {
                    setError('Impossible de récupérer la météo. Vérifiez votre entrée ou les autorisations GPS.');
                }
            }, () => {
                setError('Impossible de récupérer votre position.');
            });
        } else {
            setError('La géolocalisation n\'est pas supportée par votre navigateur.');
        }
    };

    const suggestClothing = (temp) => {
        if (temp < 10) return "Portez un manteau chaud et des gants.";
        if (temp < 20) return "Une veste légère devrait suffire.";
        if (temp < 30) return "Un t-shirt et un jean sont recommandés.";
        return "Il fait chaud, optez pour des vêtements légers comme un short et un t-shirt.";
    };

    return (
        <div className="min-h-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Bonjour, entrez votre emplacement</h1>
                <input 
                    type="text" 
                    placeholder="Entrez votre ville ou code postal" 
                    className="p-2 border border-gray-300 rounded mb-4 w-full"
                    value={location}
                    onChange={handleLocationInput}
                />
                <button 
                    onClick={handleWeatherFetch} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Vérifier la météo
                </button>
                <div className="my-4">ou</div>
                <button 
                    onClick={handleGeolocation} 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                >
                    Utiliser ma position actuelle
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {weather && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Météo à {weather.location.name}</h2>
                        <p>{weather.forecast.forecastday[0].day.condition.text}</p>
                        <p>Température: {weather.forecast.forecastday[0].day.avgtemp_c}°C</p>
                        <p className="mt-4">{suggestClothing(weather.forecast.forecastday[0].day.avgtemp_c)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Welcome;
