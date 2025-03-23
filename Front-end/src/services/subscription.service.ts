import axios from 'axios';
import config from '../config.js';
import { Subscription } from '../models/subscription.model.js';

export function getSubscriptionsFromSelfUser(): Promise<Subscription[]> {
    return new Promise((resolve, reject) => {
        axios.get(`${config.API_ROUTE}/subscriptions/me`)
            .then(response => {
                const subscriptions = response.data.content.map((subscription: Subscription) => {
                    subscription.entry = new Date(subscription.entry);
                    subscription.exit = new Date(subscription.exit);
                    subscription.event.start = new Date(subscription.event.start);
                    subscription.event.end = new Date(subscription.event.end);
                    return subscription
                });
                resolve(subscriptions);
            }).catch(error => {
                reject(error);
            });
    });
};

export function subscribe(eventId: number) {
    return new Promise((resolve, reject) => {
        axios.post(`${config.API_ROUTE}/subscriptions/me`, { eventId: eventId })
            .then(response => {
                resolve(response.data.content);
            }).catch(error => {
                reject(error);
            });
    });
};

export function unsubscribe(eventId: number) {
    return new Promise((resolve, reject) => {
        axios.delete(`${config.API_ROUTE}/subscriptions/me`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                eventId: eventId
            }
        }).then(response => {
            resolve(response.data.content);
        }).catch(error => {
            reject(error);
        });

    });
};

export function recordAttendance(eventId: number, userEmail: string): Promise<Subscription> {
    return new Promise((resolve, reject) => {
        axios.post(`${config.API_ROUTE}/subscriptions/record`, { eventId: eventId, userEmail: userEmail })
            .then(response => {
                resolve(response.data.content);
            }).catch(error => {
                reject(error);
            });
    });
};
