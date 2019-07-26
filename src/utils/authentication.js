import decode from 'jwt-decode';

export default () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    decode(token);
    decode(refreshToken);
  } catch (error) {
    return false;
  }
  return true;
};
