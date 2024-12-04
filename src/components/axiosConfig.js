import axios from 'axios';

const axiosConfigurated = axios.create({
    baseURL: "http://localhost:5868/api/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

axiosConfigurated.interceptors.request.use(function (config) {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers['Authorization'] = "Bearer " + token;
    }

    return config;
    }, function (error) {
        return Promise.reject(error);
    }
);

axiosConfigurated.interceptors.response.use(
    function (response) {
        return response;
    }, async function (error) {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refresh_token = localStorage.getItem("refresh_token");
                const response = await axios.post("http://localhost:5868/api/auth/refresh-token", 
                    {},
                    {
                        headers: {
                            'Authorization': 'Bearer ' + refresh_token
                        }
                    }
                );
                const { access_token } = response.data;

                localStorage.setItem("access_token", access_token);
                originalRequest.headers["Authorization"] = "Bearer " + token;
                return axiosConfigurated(originalRequest);
            } catch (Error) {
                const refresh_token = localStorage.getItem("refresh_token");
                await axios.post("http://localhost:5173/api/auth/logout", { refresh_token: refresh_token });
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            }
        }
    return Promise.reject(error);
  }
);

export default axiosConfigurated;
