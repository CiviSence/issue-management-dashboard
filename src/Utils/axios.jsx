import axios from "axios";


const instance = axios.create({
  baseURL: 'https://csmbsckend.onrender.com/api',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwiZXhwIjoxNzY5NzgzNDY1LCJqdGkiOiJlM2IxZjllZS0yMzNjLTQ1ZDYtODE5OC0wYzk2NTg1YjcwMDciLCJpYXQiOjE3Njk3ODE2NjUsInVhIjoiODE2MTQ3YmVkZDg0MzE3YSJ9.rmXm9DNNTY3R2e_oht8CQ9O-fHsQXh3mePHcTDFxZZo'

},
});

export default instance;