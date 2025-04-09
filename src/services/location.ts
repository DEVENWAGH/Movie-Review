export const getUserLocation = async () => {
  try {
    return 'IN'; // Changed default to India
  } catch (error) {
    console.error('Location service error:', error);
    return 'IN'; // Changed fallback to India
  }
};
