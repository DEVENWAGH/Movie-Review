export async function getUserLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country || 'IN';
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'IN'; // Default to India if error
  }
}

export const countryNames: { [key: string]: string } = {
  IN: 'India',
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  FR: 'France',
  DE: 'Germany',
  IT: 'Italy',
  ES: 'Spain',
  BR: 'Brazil',
  MX: 'Mexico',
  JP: 'Japan',
  KR: 'South Korea',
  RU: 'Russia',
  // Add more countries as needed
};
