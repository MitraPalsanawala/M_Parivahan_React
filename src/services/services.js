import axios from "axios";
const config = { headers: { 'Content-Type': `multipart/form-data` } }
const API_URL = "http://localhost:1342/api/";

class services {
     API_URL = "http://localhost:1342/api/";
    JsonValue(data){return axios(data)}
    FormValue(form) { return axios.post(API_URL + "Booking/setStartBooking", form, config); }
    FinishFormValue(form) { return axios.post(API_URL + "Booking/setFinishBooking", form, config); }
    CompleteFormValue(form) { return axios.post(API_URL + "Booking/setCompleteBooking", form, config); }
}
export default new services();