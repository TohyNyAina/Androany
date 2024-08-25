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
    const [loading, setLoading] = useState(false); 

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
        setLoading(true); 
        try {
            const apiKey = 'ee5e0f4ea27e4f45b00160822242208'; // Remplacez par votre clé API de l'API météo
            const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1&lang=fr`);
            setWeather(response.data);
            setError('');
            setIsOpen(true);
        } catch (error) {
            setError('Impossible de récupérer la météo. Vérifiez votre entrée ou les autorisations GPS.');
        } finally {
            setLoading(false); 
        }
    };

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            setLoading(true); 
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
                } finally {
                    setLoading(false); 
                }
            }, () => {
                setError('Impossible de récupérer votre position.');
                setLoading(false); 
            });
        } else {
            setError('La géolocalisation n\'est pas supportée par votre navigateur.');
        }
    };

    const suggestClothingAndImage = (temp) => {
        if (temp < 10) {
            return {
                text: "Portez un manteau chaud et des gants.",
                image: "/img/veste chaud.jpg" 
            };
        } else if (temp < 20) {
            return {
                text: "Une veste légère devrait suffire.",
                image: "/img/veste legere.jpg" 
            };
        } else if (temp < 30) {
            return {
                text: "Un t-shirt et un jean sont recommandés.",
                image: "/img/tee-shirt.jpg" 
            };
        } else {
            return {
                text: "Il fait chaud, optez pour des vêtements légers comme un short et un t-shirt.",
                image: "/img/short.jpg" 
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
                        Utiliser votre position
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
                
                {loading && <p className="mt-4">Chargement...</p>} 

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
                                    className="w-32 h-auto mt-4" 
                                />
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700 transition duration-300"
                            >
                                Fermer
                            </button>
                        </motion.div>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default Welcome;
