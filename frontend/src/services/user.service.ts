import axios from 'axios';
import config from '../config.js';
import { User } from '../models/user.model.js';

/**
 * Busca os dados do usuário autenticado.
 * @returns Promise que resolve para um objeto User.
 */
export function getSelfUser(): Promise<User> {
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/users/me`)
            .then(response => {
                resolve(response.data.content);
            }).catch(error => {
                reject(error);
            });
    });
};

/**
 * Busca usuários pelo termo informado (e-mail ou nome).
 * @param term - Termo de busca (e-mail ou nome).
 * @returns Promise que resolve para um array de usuários encontrados.
 */
export function findUsers(term: string) {
    return new Promise((resolve, reject) => {
        if (!term) resolve([]);
        axios.get(`${config.API_ROUTE}/users/find?email=${term}&name=${term}`)
            .then(response => {
                resolve(response.data.content);
            }).catch(error => {
                reject(error);
            });
    });
};