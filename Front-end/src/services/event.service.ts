import axios from 'axios';
import config from '../config.js';
import { Event } from '../models/event.model.js';
import { Subscription } from '../models/subscription.model.js';

export function getEvents(): Promise<Event[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/events/`)
            .then(response => {
                const events = response.data.content.map((event: Event) => {
                    event.start = new Date(event.start);
                    event.end = new Date(event.end);
                    return event;
                })
                resolve(events);
            }).catch(error => {
                reject(error);
            });
    });
};

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