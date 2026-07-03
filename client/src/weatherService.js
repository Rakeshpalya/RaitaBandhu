export async function fetchOpenWeatherForecast(lat, lon) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_OPENWEATHER_API_KEY in environment variables.');
  }

  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`OpenWeatherMap API error ${response.status}: ${payload}`);
  }
  return response.json();
}
