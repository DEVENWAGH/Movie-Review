import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDNmZjFiN2Y2ZjU3MmFjMjljZWMyMzRmYTg3MDQ0YSIsIm5iZiI6MTczOTQzNjM5Ni41ODcwMDAxLCJzdWIiOiI2N2FkYjE2Y2VkZjRiNTY2ZTZkMGE5NGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Bw822M-_ipjgezryIr4oSQcQopRVWSRD8u5J5nDOU_k'
  }
});

export default instance;