import axios from 'axios';
import config from '../config.js';
import { Parameters } from '../models/parameters.model.js';
import { parseISO, addHours} from 'date-fns';

/**
 * Busca os parâmetros do sistema na API.
 * Converte os horários dos parâmetros para o fuso horário do Brasil (UTC-3).
 * Tenta novamente em caso de erro, conforme o número de tentativas e atraso definidos.
 * @param retries - Número de tentativas restantes (padrão: 1).
 * @param delay - Tempo de espera entre tentativas em milissegundos (padrão: 1000ms).
 * @returns Promise que resolve para um objeto Parameters.
 */
export function getParameters(retries = 1, delay = 1000): Promise<Parameters> {
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/parameters`)
            .then(response => {
                let parameters: Parameters = response.data.content;

                // NECESSÁRIO CONVERTER DEVIDO AO FUSO HORÁRIO DA API, CASO HOSPEDADO FORA DO BRASIL
                parameters.eventsStart = addHours(parameters.eventsStart, 3);
                parameters.eventsEnd = addHours(parameters.eventsEnd, 3);
                parameters.subscriptionsStart = addHours(parameters.subscriptionsStart, 3);
                parameters.subscriptionsEnd = addHours(parameters.subscriptionsEnd, 3);

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

/**
 * Salva os parâmetros do sistema na API.
 * @param parametros - Objeto Parameters a ser salvo.
 * @returns Promise que resolve quando a operação for concluída.
 */
export function saveParameters(parametros: Parameters): Promise<void> {
  return axios.post(`${config.API_ROUTE}/parameters`, parametros)
}