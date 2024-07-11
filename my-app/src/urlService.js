const baseUrl = 'http://short.ly/';

export const generateShortUrl = (longUrl) => {
  // Generate a random 6-character string for the short URL
  const shortUrl = baseUrl + Math.random().toString(36).substring(2, 8);
  return { longUrl, shortUrl };
};
