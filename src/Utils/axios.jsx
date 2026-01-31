import axios from "axios";


const instance = axios.create({
  baseURL: 'https://csmbsckend.onrender.com/api',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzY5ODU2NTg3LCJqdGkiOiI3OTUyMmFlZS0zNGQ3LTQ0Y2MtYjcxZC05MzU2NmZmY2IxYjMiLCJpYXQiOjE3Njk4NTQ3ODcsInVhIjoiODE2MTQ3YmVkZDg0MzE3YSJ9.mbhz3b3FFaKLmp5GKulHePYscdF-hQxkJV7q3XfzPX4'

},
});

export default instance;