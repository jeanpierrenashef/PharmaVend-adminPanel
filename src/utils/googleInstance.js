import axios from 'axios';

const googleInstance = axios.create({
    baseURL: 'https://maps.googleapis.com/maps/api/geocode/json'
});
export default googleInstance;