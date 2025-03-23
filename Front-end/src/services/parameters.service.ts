import axios from 'axios';
import config from '../config.js';
import { Parameters } from '../models/parameters.model.js';

export function getParameters(): Promise<Parameters> {
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
                reject(error);
            });
    });
};