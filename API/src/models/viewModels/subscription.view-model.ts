import { EventViewModel } from "./event.view-model";
import { UserViewModel } from "./user.view-model";

export class SubscriptionViewModel {
    user: UserViewModel;
    event: EventViewModel;
    entry: Date;
    exit: Date;
}
