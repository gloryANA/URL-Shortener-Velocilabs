// import React, { useState } from 'react';

// const ShortenerForm = ({ onShorten }) => {
//   const [longUrl, setLongUrl] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (longUrl) {
//       onShorten(longUrl);
//       setLongUrl(''); // Clear the input field
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="url"
//         value={longUrl}
//         onChange={(e) => setLongUrl(e.target.value)}
//         placeholder="Enter URL to shorten"
//         required
//       />
//       <button type="submit">Shorten URL</button>
//     </form>
//   );
// };

// export default ShortenerForm;


import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const ShortenerForm = ({ onShorten }) => {
  const [longUrl, setLongUrl] = useState('');
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const shortUrl = onShorten(longUrl);
    history.push(`/${shortUrl}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="Enter URL to shorten"
        required
      />
      <button type="submit">Shorten URL</button>
    </form>
  );
};

export default ShortenerForm;

