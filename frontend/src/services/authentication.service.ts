import axios from "axios";
import config from "../config";

/**
 * Armazena o JWT no localStorage.
 * @param jwt - Token JWT a ser salvo.
 */
export function setJWT(jwt: string) {
    localStorage.setItem('token', jwt);
}

/**
 * Realiza o login do usuário.
 * @param email - E-mail do usuário.
 * @param password - Senha do usuário.
 * @returns Promise que resolve quando o login é bem-sucedido.
 */
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

/**
 * Realiza o cadastro de um novo usuário.
 * @param email - E-mail do usuário.
 * @param password - Senha do usuário.
 * @returns Promise que resolve quando o cadastro é bem-sucedido.
 */
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

/**
 * Remove todos os dados do localStorage, efetivando o logout.
 */
export function signOut() {
    localStorage.clear();
}

/**
 * Solicita a recuperação de senha para o e-mail informado.
 * @param email - E-mail do usuário.
 * @returns Promise que resolve quando a solicitação é enviada.
 */
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

/**
 * Redefine a senha do usuário usando o token recebido por e-mail.
 * @param token - Token de redefinição de senha.
 * @param password - Nova senha.
 * @returns Promise que resolve quando a senha é redefinida.
 */
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