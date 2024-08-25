import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const Welcome = () => {
    const [location, setLocation] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);

    const handleLocationInput = async (e) => {
        const value = e.target.value;
        setLocation(value);

        if (value.length > 2) {
            try {
                const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${value}`);
                setSuggestions(response.data.features.map(feature => feature.properties.label));
            } catch (err) {
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleWeatherFetch = async () => {
        try {
            const apiKey = 'ee5e0f4ea27e4f45b00160822242208'; // Remplacez par votre clé API de l'API météo
            const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1&lang=fr`);
            setWeather(response.data);
            setError('');
            setIsOpen(true);
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
                    const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=1&lang=fr`);
                    setWeather(response.data);
                    setError('');
                    setIsOpen(true);
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

    const suggestClothingAndImage = (temp) => {
        if (temp < 10) {
            return {
                text: "Portez un manteau chaud et des gants.",
                image: "/images/manteau_chaud.jpg" // Chemin vers l'image locale du manteau chaud
            };
        } else if (temp < 20) {
            return {
                text: "Une veste légère devrait suffire.",
                image: "/images/veste_legere.jpg" // Chemin vers l'image locale de la veste légère
            };
        } else if (temp < 30) {
            return {
                text: "Un t-shirt et un jean sont recommandés.",
                image: "/images/tshirt_jean.jpg" // Chemin vers l'image locale du t-shirt et jean
            };
        } else {
            return {
                text: "Il fait chaud, optez pour des vêtements légers comme un short et un t-shirt.",
                image: "/images/short_tshirt.jpg" // Chemin vers l'image locale du short et t-shirt
            };
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Bonjour, entrez votre emplacement</h1>
                <div className="flex">
                    <input 
                        type="text" 
                        placeholder="Entrez votre ville ou code postal" 
                        className="p-2 border border-gray-300 rounded mb-4 w-full"
                        value={location}
                        onChange={handleLocationInput}
                    />
                    <button 
                        onClick={handleGeolocation} 
                        className="bg-green-500 text-white px-4 py-2 ml-2 rounded hover:bg-green-700 transition duration-300"
                    >
                        📍
                    </button>
                </div>
                {suggestions.length > 0 && (
                    <ul className="border border-gray-300 rounded mb-4">
                        {suggestions.map((suggestion, index) => (
                            <li 
                                key={index} 
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setLocation(suggestion);
                                    setSuggestions([]);
                                }}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
                <button 
                    onClick={handleWeatherFetch} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Vérifier la météo
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setIsOpen(false)}
                    style={customStyles}
                    contentLabel="Résultats Météo"
                >
                    {weather && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-xl font-bold">Météo à {weather.location.name}</h2>
                            <div className="flex items-center">
                                <img src={`https:${weather.current.condition.icon}`} alt="Icone Météo" className="w-12 h-12 mr-2" />
                                <p>{weather.current.condition.text}</p>
                            </div>
                            <p>Température: {weather.current.temp_c}°C</p>
                            <div className="mt-4">
                                <p>{suggestClothingAndImage(weather.current.temp_c).text}</p>
                                <img 
                                    src={suggestClothingAndImage(weather.current.temp_c).image} 
                                    alt="Vêtements recommandés"
                                    className="w-full h-auto mt-4"
                                />
                            </div>
                        </motion.div>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default Welcome;
