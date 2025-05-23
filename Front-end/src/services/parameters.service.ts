import axios from 'axios';
import config from '../config.js';
import { Parameters } from '../models/parameters.model.js';

export function getParameters(retries = 1, delay = 1000): Promise<Parameters> {
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/parameters`)
            .then(response => {
                let parameters: Parameters = response.data.content;
                parameters.eventsStart = new Date(parameters.eventsStart);
                parameters.eventsEnd = new Date(parameters.eventsEnd);
                parameters.subscriptionsStart = new Date(parameters.subscriptionsStart);
                parameters.subscriptionsEnd = new Date(parameters.subscriptionsEnd);

                resolve(response.data.content);
            }).catch(error => {
                if (retries > 0) {
                    console.warn(`Erro ao carregar parâmetros. Tentando novamente em ${delay / 1000}s...`);
                    setTimeout(() => {
                        getParameters(retries - 1, delay).then(resolve).catch(reject);
                    }, delay);
                } else {
                    reject(error);
                }
            });
    });
};

//Manda a requisição para salvar os parametros do sistema
export function saveParameters(parametros: Parameters): Promise<void> {
  return axios.post(`${config.API_ROUTE}/parameters`, parametros)

}
