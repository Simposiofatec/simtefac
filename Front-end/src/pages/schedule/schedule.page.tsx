import { useContext, useEffect, useState } from 'react';
import styles from './schedule.module.css';
import { Parameters } from '../../models/parameters.model';
import { EventContext, ParametersContext, SubscriptionsContext } from '../../App';
import { Event } from '../../models/event.model';
import Skeleton from 'react-loading-skeleton';
import { getDaysBetweenDates, getDayOfMonth, getDayOfWeek } from '../../helpers/dateFunctions';
import { classNames } from '../../helpers/stylingFunctions';
import { ScheduleEvent } from '../../components/schedule-event/schedule-event.component';
import CheckCircle from '../../assets/check-circle.svg';
import { Subscription } from '../../models/subscription.model';
import { event } from 'jquery';


export function Schedule(props: any) {
    const parameters = useContext<Parameters | undefined>(ParametersContext);
    const events = useContext(EventContext);
    const subscriptions = useContext(SubscriptionsContext);


    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const initialSelectedDate = parameters && today.getTime() < parameters.eventsStart.getTime() ? parameters.eventsStart : today;
        setSelectedDate(initialSelectedDate);
    }, [parameters])

    if (!parameters) {
        return (
            <></>
        )
    }

    let visibleDays: Date[] = [];

    for (let i = 0; i < getDaysBetweenDates(parameters.eventsStart, parameters.eventsEnd); i++) {
        let date = new Date(parameters.eventsStart);
        date.setDate(date.getDate() + i);
        visibleDays.push(date);
    }

    const eventsOfDay: Event[] = events?.filter((event: Event) => {
        return (
            event.start.getDate() === selectedDate?.getDate() &&
            event.start.getMonth() === selectedDate?.getMonth() &&
            event.start.getFullYear() === selectedDate?.getFullYear()
        );
    })
        .sort((a: Event, b: Event) => {
            return a.start.getTime() - b.start.getTime()
        }) || [];

    return (
        <div className={styles.wrapper}>
            <div className={styles.dayTabs_wrapper}>
                {visibleDays.map((date) => {
                    return (
                        <div
                            className={classNames(
                                styles.day_tabs_item,
                                selectedDate?.getTime() === date.getTime() ? styles.current : ''
                            )}
                            onClick={() => setSelectedDate(date)}
                            key={date.toISOString()}
                        >
                            {subscriptions !== undefined &&
                                subscriptions.find((subscription: Subscription) => {
                                    const eventsOfDay: Event[] = events?.filter(function (event: Event) {
                                        return (
                                            event.start.getDate() === date?.getDate() &&
                                            event.start.getMonth() === date?.getMonth() &&
                                            event.start.getFullYear() === date?.getFullYear()
                                        );
                                    }) || [];

                                    return eventsOfDay.find((event: Event) => {
                                        return event.id === subscription.event.id
                                    }) !== undefined;
                                }) !== undefined &&
                                <img src={CheckCircle}></img>
                            }
                            <div>
                                <span>{getDayOfWeek(date)}</span>
                                <span>{getDayOfMonth(date)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={styles.events_wrapper}>
                {
                    events === undefined &&
                    <Skeleton count={5} height={'90px'}></Skeleton>
                }
                {
                    events !== undefined &&
                    eventsOfDay.map((event: Event) => {
                        return (
                            <ScheduleEvent
                                key={event.id}
                                event={event}
                            >
                            </ScheduleEvent>
                        )
                    })
                }
            </div>

        </div >
    )
}
