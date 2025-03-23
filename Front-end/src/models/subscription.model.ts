import { User } from "./user.model";
import { Event } from "./event.model";

export interface Subscription {
    user: User;
    event: Event;
    entry: Date;
    exit: Date;
}