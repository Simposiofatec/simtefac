import { useContext, useEffect, useRef, useState } from "react";
import { EventContext } from "../../App";
import { event } from "jquery";
import { ToasterError } from "../../helpers/toastr";
import { useNavigate } from "react-router-dom";
import { Event } from "../../models/event.model";
import styles from './attendance-record.module.css'
import { findUsers } from "../../services/user.service";
import { Html5Qrcode, Html5QrcodeCameraScanConfig, QrcodeErrorCallback } from "html5-qrcode";
import { Html5QrcodeError, Html5QrcodeResult, QrcodeSuccessCallback } from "html5-qrcode/esm/core";
import AttendanceRecordConfirmation from "../../modals/attendance-record-confirmation.modal";

export default function AttendanceRecord() {
    const events = useContext(EventContext);

    const [canRender, setCanRender] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [event, setEvent] = useState<Event | undefined>(undefined);
    const [user, setUser] = useState(undefined);

    const [isAttendanceRecordConfirmationOpen, setIsAttendanceRecordConfirmationOpen] = useState(false);

    const searchTermInputRef = useRef<any>(undefined)
    const previewRef = useRef<any>(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        if (!events)
            return;

        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        const event = events.find(event => event.id == eventId);

        if (!event) {
            ToasterError('Evento não encontrado.')
            navigate('/Programacao');
            return;
        }

        setEvent(event);
        setCanRender(true);
        setIsLoading(false);
    }, [events])

    useEffect(() => {
        const previewContainer = document.getElementById('reader');
        if (!previewContainer) return;
        previewContainer.innerHTML = '';

        const html5QrCode = new Html5Qrcode('reader');

        const qrCodeSuccessCallback: QrcodeSuccessCallback = (decodedText: string, decodedResult: Html5QrcodeResult) => {
            showAttendanceRecordConfirmation(decodedText);
        };

        const qrCodeErrorCallback: QrcodeErrorCallback = (errorMessage: string, error: Html5QrcodeError) => {

        }

        const config: Html5QrcodeCameraScanConfig = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 };

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            qrCodeSuccessCallback,
            qrCodeErrorCallback
        )
            .then(() => {
                if (previewRef.current.childElementCount > 1) {
                    previewRef.current.children[1].remove();
                }
            }).catch((reason) => {
                alert(reason)
                ToasterError('Não foi possível iniciar a câmera. Verifique a permissão da página.');
                setCanRender(false);
            });
    }, [canRender]);

    const showAttendanceRecordConfirmation = (userId: string) => {
        findUsers(userId).then((users: any) => {
            const user = users[0];

            if (!user) {
                ToasterError('Nenhum usuário encontrado.');
                setIsLoading(false);
                return;
            }

            setUser(user);
            setIsAttendanceRecordConfirmationOpen(true);

            searchTermInputRef.current.value = '';
            setIsLoading(false);
        })
    }

    return (
        <>
            {!canRender &&
                <div style={{ padding: '20px' }}>
                    <button
                        className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        onClick={() => {
                            setCanRender(true);
                        }}
                        disabled={isLoading}
                    >
                        {isLoading &&
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                        }
                        Abrir Camera</button>
                </div>
            }
            {canRender && (
                <>
                    <div className={styles.cameraWrapper}>
                        <div id="reader" style={{ width: '100%' }} ref={previewRef}></div>
                    </div>
                    <div className={styles.cameraFooter}>
                        <div className="col-span-6 sm:col-span-3 text-left mb-4">
                            <label htmlFor="loginInput" className="block text-sm font-medium text-gray-700">
                                Nome ou E-Mail
                            </label>
                            <input
                                type="text"
                                name="searchTerm"
                                id="searchTermInput"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                autoComplete='off'
                                placeholder=''
                                ref={searchTermInputRef}
                            />
                        </div>
                        <button
                            className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            onClick={() => {
                                setIsLoading(true);
                                showAttendanceRecordConfirmation(searchTermInputRef.current.value)
                            }}
                            disabled={isLoading}
                        >
                            {isLoading &&
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-indigo-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                            }
                            Buscar
                        </button>
                    </div>
                </>
            )}
            {isAttendanceRecordConfirmationOpen && (
                <AttendanceRecordConfirmation
                    onClose={() => { setIsAttendanceRecordConfirmationOpen(false) }}
                    user={user}
                    event={event}
                >
                </AttendanceRecordConfirmation>
            )}
        </>
    )
}