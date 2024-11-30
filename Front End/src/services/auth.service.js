const AuthService={
    facebookAuth: async (accessToken) => {
        const response = await axios.post(`${Environment.BASE_API}/auth/facebook-auth`, { accessToken });
      
        return response.data;
      }
}