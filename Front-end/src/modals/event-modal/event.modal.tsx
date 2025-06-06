import styles from './event.modal.module.css';
import '../../fonts/css/simtefac-embedded.css'
import { useContext, useRef, useState } from 'react';
import { isHexDark } from '../../helpers/colorFunctions';
import { Subscription } from '../../models/subscription.model';
import { ParametersContext, RefreshFunctionsContext, SubscriptionsContext, UserContext } from '../../App';
import { User } from '../../models/user.model';
import { useNavigate } from 'react-router-dom';
import { Parameters } from '../../models/parameters.model';
import { subscribe, unsubscribe } from '../../services/subscription.service';
import { ToasterError } from '../../helpers/toastr';
import { hover } from '@testing-library/user-event/dist/hover';

function extractSpeakersOrBanca(description: string): { speakers: string[], banca: string[] } {
    const banca = Array.from(
        description.matchAll(/<strong>Banca avaliadora:<\/strong>\s*([^.<\n]+)/gi),
        m => m[1].replace(/[.:]/g, '').trim()
    );
    const speakers = Array.from(
        description.matchAll(/Palestrante?:?\s*([^\n<]+)/gi),
        m => m[1].replace(/[.:]/g, '').trim()
    );
    return { speakers, banca };
}

export function EventModal(props: any) {

    const user = useContext<User | undefined>(UserContext);
    const subscriptions = useContext<Subscription[] | undefined>(SubscriptionsContext);
    const parameters = useContext<Parameters | undefined>(ParametersContext);
    const { refreshSubscriptions, refreshEvents } = useContext(RefreshFunctionsContext);
    const navigate = useNavigate();
    const modalCardRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const { event, onClose } = props;

    const onSubscribeClick = () => {
        setIsLoading(true);
        subscribe(event.id).then(
            () => {
                let subscriptionsRefreshed = false;
                let eventsRefreshed = false;
                refreshSubscriptions().finally(() => {
                    subscriptionsRefreshed = true;
                    if (eventsRefreshed)
                        setIsLoading(false);
                });
                refreshEvents().finally(() => {
                    eventsRefreshed = true;
                    if (subscriptionsRefreshed)
                        setIsLoading(false);
                });
            })
            .catch(
                error => {
                    refreshEvents();
                    refreshSubscriptions();
                    if (error.response.status !== 401)
                        ToasterError(error.response.data.message, 30000);
                    setIsLoading(false);
                }
            );
    }
    const onUnsubscribeClick = () => {
        setIsLoading(true);
        unsubscribe(event.id).then(
            () => {
                let subscriptionsRefreshed = false;
                let eventsRefreshed = false;
                refreshSubscriptions().finally(() => {
                    subscriptionsRefreshed = true;
                    if (eventsRefreshed)
                        setIsLoading(false);
                });
                refreshEvents().finally(() => {
                    eventsRefreshed = true;
                    if (subscriptionsRefreshed)
                        setIsLoading(false);
                });
            })
            .catch(
                error => {
                    refreshEvents();
                    refreshSubscriptions();
                    if (error.response.status !== 401)
                        ToasterError(error.response.data.message, 30000);
                    setIsLoading(false);
                }
            );
    }
    

    const options = { hour: '2-digit', minute: '2-digit' }; // sem timeZone
    const strStartDate = event.start.toLocaleDateString('pt-BR');
    const strStartTime = event.start.toLocaleTimeString('pt-BR', options);
    const strEndTime = event.end.toLocaleTimeString('pt-BR', options);

    const bConflict = subscriptions !== undefined && subscriptions.find((subscription: Subscription) => {
        const startInscricao = subscription.event.start;
        const startPalestra = props.event.start;

        return subscription.event.id !== props.event.id && (
            startPalestra.getDate() === startInscricao.getDate() &&
            startPalestra.getMonth() === startInscricao.getMonth() &&
            startPalestra.getFullYear() === startInscricao.getFullYear()

        );
    }) !== undefined;

    const bIsFull = event.subscriptionCount >= event.maximumCapacity;

    const bIsBeforeSubscriptionDate: boolean = parameters !== undefined && parameters.subscriptionsStart.getTime() > new Date().getTime();
    const bIsAfterSubscriptionDate: boolean = parameters !== undefined && parameters.subscriptionsEnd.getTime() < new Date().getTime();

    const bIsInEventDate: boolean = parameters != undefined && parameters.eventsStart.getTime() < new Date().getTime() && parameters.eventsEnd.getTime() > new Date().getTime();


    const { speakers, banca } = extractSpeakersOrBanca(event.description);
    
    return (
        <>
            <div className={`${styles.modal_background}`}
                onClick={(event) => {
                    event.preventDefault();
                    event.nativeEvent.stopPropagation();
                    onClose();
                }}>
            </div >
            <button
                className='modal-close-button'
                onClick={(event) => {
                    event.preventDefault();
                    event.nativeEvent.stopPropagation();
                    onClose();
                }}
            >
                <i className='icon-cancel'></i>
            </button>
            <div
                className={`${styles.modal_card}`}
                ref={modalCardRef}
            >
                <div
                    className={`${styles.modal_header}`}
                    style={{ backgroundColor: event.color }}
                >
                    <h2
                        style={{color: isHexDark(event.color) ? 'white' : 'black' }}
                    >{event.title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: event.color, filter: 'saturate(1.2)'}}>
                        <i className='icon-group' style={{fontSize:"1.3rem" ,color: isHexDark(event.color) ? 'white' : 'black'}}></i>
                        <span className={`${styles.event_subscription_count}`} style={{color: isHexDark(event.color) ? 'white' : 'black'}}>{`${event.subscriptionCount}/${event.maximumCapacity}`}</span>
                    </div>
                </div>
                <div
                    className={`${styles.modal_content}`}
                >
                    <div className={`${styles.event_details_wrapper}`}>
                        <div className={`${styles.event_detail}`}>
                            <div className={`${styles.event_detail_row}`}>
                                <div>
                                    <div className={`${styles.event_detail_icon}`}>
                                        <i className='icon-calendar' style={{color: event.color, fontSize: "1.5rem"}}></i>
                                        <h5>Data</h5>
                                    </div>
                                    <div className={`${styles.event_detail_info}`}>{strStartDate}</div>
                                </div>
                            </div>
                            <div className={`${styles.event_detail_row}`}>
                                <div>
                                    <div className={`${styles.event_detail_icon}`}>
                                        <i className='icon-clock' style={{color: event.color, fontSize: "1.5rem"}}></i>
                                        <h5>Horário</h5>
                                    </div>
                                    <div className={`${styles.event_detail_info}`}>{strStartTime} - {strEndTime}</div>
                                </div>
                            </div>
                            <div className={`${styles.event_detail_row}`}>
                                <div>
                                    <div className={`${styles.event_detail_icon}`}>
                                        <i className='icon-place' style={{color: event.color, fontSize: "1.5rem"}}></i>
                                        <h5>Local</h5>
                                    </div>
                                    <div className={`${styles.event_detail_info}`}>{event.place}</div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.event_detail_row}`}>
                            {
                                bIsInEventDate && user && user.attributes.includes('ADM') &&
                                <button
                                    className="w-full mt-5 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    onClick={() => navigate(`/RegistroDePresenca?eventId=${event.id}`)}
                                >
                                    {isLoading &&
                                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                        </svg>
                                    }
                                    Coletar Presença
                                </button>
                            }
                        </div>
                    </div>
                    <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap:"0.2rem", marginBottom: '0.5rem' }}>
                        <svg style={{width: "1.3rem"}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <span style={{fontWeight: "600", fontSize: "1.1rem"}}>
                            {banca.length > 0 ? 'Banca Avaliadora' : 'Palestrante'}
                        </span>
                    </div>
                    <div className={`${styles.event_speaker_details}`}>
                        {banca.length > 0
                            ? banca.join(', ')
                            : (speakers.length > 0 ? speakers.join(', ') : "Palestrante não informado")}
                    </div>
                    </div>
                    <div className={`${styles.event_description}`}>	
                        <span>Descrição do Evento</span>
                        <div className={`${styles.event_description_wrapper}`}
                        dangerouslySetInnerHTML={{ __html: event.description }} />
                    </div>
                </div>
                <div
                    className={`${styles.modal_footer}`}
                >
                    {
                        (subscriptions === undefined || subscriptions.find(subscription => subscription.event.id === event.id) === undefined) &&
                        <button
                            className={`${styles.event_subscribe_button} w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50`}                            onClick={onSubscribeClick}
                            disabled={isLoading || bConflict || bIsFull || bIsBeforeSubscriptionDate || bIsAfterSubscriptionDate}
                            style={{backgroundColor: event.color, color: isHexDark(event.color) ? 'white' : 'black', fontWeight: '600', }}
                        >
                            {isLoading &&
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142    100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                            }
                            {bIsBeforeSubscriptionDate ? 'Inscrições fechadas' : bIsAfterSubscriptionDate ? 'Inscrições Encerradas' : bIsFull ? 'LOTADO' : 'Inscrever-se'}
                        </button>
                    }
                    {
                        subscriptions?.find(subscription => subscription.event.id === event.id) &&
                        <button
                            className="mt-2 w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-indigo-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            onClick={onUnsubscribeClick}
                            disabled={isLoading || bIsAfterSubscriptionDate || bIsBeforeSubscriptionDate}
                        >
                            {isLoading &&
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-indigo-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                            }
                            {bIsBeforeSubscriptionDate || bIsAfterSubscriptionDate ? 'Inscrito' : 'Desinscrever-se'}
                        </button>
                    }
                </div>
            </div>
        </>
    )
}