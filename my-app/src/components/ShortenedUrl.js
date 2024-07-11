// import React from 'react';

// const ShortenedUrl = ({ shortUrl }) => {
//   if (!shortUrl) return null;

//   return (
//     <div>
//       <h3>Your shortened URL:</h3>
//       <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
//     </div>
//   );
// };

// export default ShortenedUrl;

import React from 'react';
import { Redirect } from 'react-router-dom';

const ShortenedUrl = ({ shortUrl }) => {
  if (!shortUrl) return null;

  // Simulate redirection to the shortened URL
  return <Redirect to={shortUrl} />;
};

export default ShortenedUrl;

