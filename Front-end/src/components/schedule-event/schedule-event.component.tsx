import { CSSProperties, useContext, useRef, useState } from "react";
import { ParametersContext, SubscriptionsContext } from "../../App";
import { Parameters } from "../../models/parameters.model";
import { isHexDark, darkenHexColor } from "../../helpers/colorFunctions";
import styles from './schedule-event.module.css';
import '../../fonts/css/simtefac-embedded.css'
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
        backgroundColor: "#1d283d",
        border: `0.5px solid ${props.event.color || '#f5ac70'}`,
        borderRadius: '0.5rem',
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
                style={{
                ...style, padding: "1rem",
                borderTop: `4px solid ${props.event.color || '#f5ac70'}`
                }}                
                onClick={openModal}
                ref={eventCardRef}
            >
                <div style={{ display: "flex", justifyContent: "space-between", height: "100%"}}>
                    <span className={styles.title} style={{maxWidth:"80%"}} >{props.event.title}</span>
                    <div>
                        <i className='icon-group' style={{fontSize:"1.5vw" ,color: "#c7c7c7"}}></i>
                        <span className={`${styles.event_subscription_count}`} style={{color: "#c7c7c7"}}>{`${event.subscriptionCount}/${event.maximumCapacity}`}</span>
                    </div>
                </div>
                <div className={`${styles.event_detail}`}>
                    <div>
                        <i className='icon-clock' style={{fontSize: "1rem", color: `${event.color}`}}></i>
                        <span style={{fontWeight: "500", color: "#C7C7C7"}} className={`${styles.time}`}>{`${strStartTime} - ${strEndTime}`} {bIsFull && '[LOTADO]'}</span>
                    </div>
                    <div className={`${styles.event_detail_icon}`}>
                        <i className='icon-place' style={{fontSize: "1rem", color:  `${event.color}`}}></i>
                        <div className={`${styles.event_detail_info}`} style={{fontWeight:"500",color: "#C7C7C7"}}>{event.place}</div>
                    </div>
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