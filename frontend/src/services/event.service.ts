import axios from 'axios';
import config from '../config.js';
import { Event } from '../models/event.model.js';
import { Subscription } from '../models/subscription.model.js';
import { addHours } from 'date-fns';

/**
 * Busca todos os eventos cadastrados na API.
 * Converte os horários dos eventos para o fuso horário do Brasil (UTC-3).
 * @returns Promise que resolve para um array de eventos.
 */
export function getEvents(): Promise<Event[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/events/`)
            .then(response => {
                // NECESSÁRIO CONVERTER DEVIDO AO FUSO HORÁRIO DA API, CASO HOSPEDADO FORA DO BRASIL
                const events = response.data.content.map((event: Event) => {
                    event.start = addHours(event.start, 3);
                    event.end = addHours(event.end, 3);
                    return event;
                })
                resolve(events);
            }).catch(error => {
                reject(error);
            });
    });
};

/**
 * Busca as inscrições de um usuário em um evento específico.
 * @param eventId - ID do evento.
 * @param userEmail - E-mail do usuário (opcional).
 * @returns Promise que resolve para um array de inscrições.
 */
export function getEventSubscriptions(eventId: number, userEmail = ''): Promise<Subscription[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/events/${eventId}/subscriptions?email=${userEmail}`)
            .then(response => {
                resolve(response.data.content);
            }).catch(error => {
                reject(error);
            });
    });
};