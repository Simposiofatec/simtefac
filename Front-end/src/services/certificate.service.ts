import axios from 'axios';
import config from '../config.js';

export function GetCertificado(): Promise<Blob> {
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/certificate/certificado`, {
            responseType: 'blob' // Tipo correto para arquivos binários
        })
        .then(response => {
            resolve(response.data); // Retorna o Blob com o arquivo
        })
        .catch(error => {
            reject(error); // Caso ocorra erro
        });
    });
}

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


