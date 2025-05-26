import axios from 'axios';
import config from '../config.js';

/**
 * Busca o certificado de um usuário pelo nome.
 * @param nome - Nome do usuário.
 * @returns Promise que resolve para um Blob contendo o certificado.
 */
export function GetCertificado(nome: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/certificate/certificado/${nome}`, {
            responseType: 'blob' // Retorna o arquivo como Blob (binário)
        })
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

/**
 * Busca a quantidade de presenças de um usuário pelo e-mail.
 * @param usuarioEmail - E-mail do usuário.
 * @returns Promise que resolve para um número representando as presenças.
 */
export function GetPresencas(usuarioEmail: string): Promise<number>{
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/certificate/verificapresenca?email=${usuarioEmail}`)
        .then(response => {
            resolve(response.data); 
        })
        .catch(error => {
            reject(error);
        });
    });
}

/**
 * Verifica se o usuário possui certificado disponível.
 * @param usuarioEmail - E-mail do usuário.
 * @returns Promise que resolve quando a verificação é concluída.
 */
export function GetPresencaCertificado(usuarioEmail:string): Promise<void>{
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/users/getCertificado?email=${usuarioEmail}`)
        .then(response => {
            resolve(response.data); 
        })
        .catch(error => {
            reject(error);
        });
    });
}