import axios from "axios";
import config from "../config";

export function setJWT(jwt: string) {
    localStorage.setItem('token', jwt);
}

export function signIn(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
        axios.post(`${config.API_ROUTE}/authentication/signin`, { email, password })
            .then(response => {
                setJWT(response.headers['authorization']);
                resolve();
            }).catch(error => {
                reject(error);
            });
    });
};

export function signUp(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
        axios.post(`${config.API_ROUTE}/authentication/signup`, { email, password })
            .then((response) => {
                resolve();
            }).catch(error => {
                reject(error);
            });
    });
};

export function signOut() {
    localStorage.clear();
}

export function recoverPassword(email: string) {
    return new Promise((resolve, reject) => {
        axios.post(`${config.API_ROUTE}/authentication/recoverpassword`, { email })
            .then((response) => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
    });
};

export function resetPassword(token: string, password: string) {
    return new Promise((resolve, reject) => {
        axios.post(`${config.API_ROUTE}/authentication/resetpassword`, { token, password })
            .then((response) => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
    });
};