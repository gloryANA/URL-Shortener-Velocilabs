
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [longUrl, setLongUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const shortenUrl = async () => {
        try {
            const response = await axios.post('http://localhost:8080/shorten', { long_url: longUrl });
            const shortUrl = response.data.short_url;
            setShortenedUrl(shortUrl);
            setErrorMessage('');
        } catch (error) {
            console.error('Error shortening URL:', error);
            setShortenedUrl('');
            setErrorMessage('Failed to shorten URL. Please try again later.');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortenedUrl);
    };

    const resetForm = () => {
        setLongUrl('');
        setShortenedUrl('');
        setErrorMessage('');
    };

    return (
        <div className="App">
            <h1 className="url-shortener-title">URL Shortener</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter URL to shorten"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                />
                <button onClick={shortenUrl}>Shorten URL</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {shortenedUrl && (
                <div className="shortened-url">
                    <h2 className="shortened-url-title">Shortened URL</h2>
                    <div className="shortened-url-container">
                        <input
                            type="text"
                            value={shortenedUrl}
                            readOnly
                            className="shortened-url-input"
                        />
                        <button onClick={copyToClipboard}>Copy</button>
                    </div>
                    <button onClick={resetForm}>Shorten Another URL</button>
                </div>
            )}
        </div>
    );
}

export default App;
