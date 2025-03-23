import { CSSProperties, useContext, useRef, useState } from "react";
import { ParametersContext, SubscriptionsContext } from "../../App";
import { Parameters } from "../../models/parameters.model";
import { isHexDark, darkenHexColor } from "../../helpers/colorFunctions";
import styles from './schedule-event.module.css';
import { EventModal } from "../../modals/event-modal/event.modal";
import { Subscription } from "../../models/subscription.model";

export function ScheduleEvent(props: any) {
    const { event } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const subscriptions = useContext(SubscriptionsContext);
    const parameters = useContext<Parameters | undefined>(ParametersContext);
    const eventCardRef = useRef(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const style: CSSProperties = {
        backgroundColor: props.event.color || '#f5ac70'
    };

    const bSubscribed = subscriptions?.find(subscription => subscription.event.id === props.event.id) ? true : false;
    const bConflict = subscriptions !== undefined && subscriptions.find((subscription: Subscription) => {
        const startInscricao = subscription.event.start;
        const startPalestra = props.event.start;

        return subscription.event.id !== props.event.id && (
            startPalestra.getDate() === startInscricao.getDate() &&
            startPalestra.getMonth() === startInscricao.getMonth() &&
            startPalestra.getFullYear() === startInscricao.getFullYear()

        );
    });

    const bIsFull = props.event.subscriptionCount >= props.event.maximumCapacity;

    const bIsBeforeSubscriptionDate: boolean = parameters !== undefined && parameters.subscriptionsStart.getTime() > new Date().getTime();
    const bIsAfterSubscriptionDate: boolean = parameters !== undefined && parameters.subscriptionsEnd.getTime() < new Date().getTime();

    if (bSubscribed) {
        if (isHexDark(event.color))
            style.borderLeft = `8px solid ${darkenHexColor(props.event.color, 50)}`
        else
            style.borderLeft = `8px solid ${darkenHexColor(props.event.color, 25)}`
    }

    if ((bConflict || bIsFull || bIsAfterSubscriptionDate || bIsBeforeSubscriptionDate) && !bSubscribed) {
        style.opacity = '25%';
        style.boxShadow = 'none';
    }

    const options = { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' };
    const strStartTime = props.event.start.toLocaleTimeString('pt-BR', options);
    const strEndTime = props.event.end.toLocaleTimeString('pt-BR', options);

    return (
        <>
            <div
                className={`${styles.event} ${isHexDark(props.event.color) ? styles.dark : styles.light}`}
                style={style}
                onClick={openModal}
                ref={eventCardRef}
            >
                <span className={`${styles.time}`}>{`${strStartTime} - ${strEndTime}`} {bIsFull && '[LOTADO]'}</span>
                <div>
                    <span className={styles.title} >{props.event.title}</span>
                </div>
            </div >
            {isModalOpen && (
                <EventModal
                    event={props.event}
                    subscriptions={subscriptions}
                    onClose={closeModal}
                    eventCard={eventCardRef}
                ></EventModal >
            )
            }
        </>
    );
}