import axios from "axios";
const API_URL = "http://localhost:1006/api/auth/";
class AuthService {
  login(UserName, Password) {
    return axios
      .post(API_URL + "login", { UserName, Password })
      .then((response) => {
        const sensor = response.data;
        if (sensor.data.Token) { localStorage.setItem("user", JSON.stringify(sensor.data)) }
        return response.data;
      });
  }
  logout() { localStorage.removeItem("user") }
  register(username, email, password) { return axios.post(API_URL + "signup", { username, email, password }); }
}
export default new AuthService();