import decode from 'jwt-decode';

export default () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    const decodedUser = decode(token);
    decode(refreshToken);
    return decodedUser.user;
  } catch (error) {
    return false;
  }
};
