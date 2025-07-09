import { useContext, useState } from "react";
import { AuthenticationModalsContext, RefreshFunctionsContext } from "../App";
import { resetPassword, signIn } from "../services/authentication.service";
import { ToasterError, ToasterSuccess } from "../helpers/toastr";

export function PasswordResetModal(props: any) {
    const { hideResetPasswordModal } = useContext<any>(AuthenticationModalsContext);
    const { refreshUser } = useContext<any>(RefreshFunctionsContext);

    const [password, setPassword] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onResetPasswordClick = () => {
        let hasError = false;
        setPasswordErrorMessage('');
        setIsLoading(true);

        if (!password) {
            setPasswordErrorMessage('Este campo deve ser preenchido.');
            hasError = true;
        }
        else if (password.length < 6) {
            setPasswordErrorMessage('A senha deve conter pelo menos 6 caracteres.');
            hasError = true;
        }
        else {
            if (!repeatPassword) {
                setRepeatPasswordErrorMessage('Este campo deve ser preenchido.');
                hasError = true;
            }
            else if (repeatPassword !== password) {
                setRepeatPasswordErrorMessage('As senhas não conferem.');
                hasError = true;
            }
        }

        if (hasError) {
            setIsLoading(false);
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token') || '';
        resetPassword(token, password)
            .then((response: any) => {
                signIn(response.data.content.email, password).then(() => {
                    ToasterSuccess("Senha alterada com sucesso.");
                    hideResetPasswordModal();
                    refreshUser();
                })
            })
            .catch(error => {
                setIsLoading(false);
                if (error.response) {
                    const responseMessage = error.response.data.message;
                    const internalCode = error.response.data.internalCode;

                    if (internalCode === 3) {
                        setPasswordErrorMessage('Este campo deve ser preenchido.');
                    }
                    else if (error.response.data.message) {
                        if (responseMessage) {
                            ToasterError(responseMessage);
                        }
                    }
                    else {
                        ToasterError('Ocorreu um erro inesperado durante a redefinição de senha.');
                    }
                }
                else {
                    ToasterError('Ocorreu um erro inesperado durante a redefinição de senha.');
                }
            });
    }

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    }
    const handleRepeatPasswordChange = (event: any) => {
        setRepeatPassword(event.target.value);
    }

    return (
        <div
            className="relative z-10"
            onClick={hideResetPasswordModal}
        >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-lg"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <div className="col-span-6 sm:col-span-3 text-left mb-4">
                                    <label htmlFor="passwordInput" className="block text-sm font-medium text-gray-700">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="passwordInput"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        autoComplete='off'
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                    {passwordErrorMessage &&
                                        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                            {passwordErrorMessage}
                                        </span>
                                    }
                                </div>
                                <div className="col-span-6 sm:col-span-3 text-left">
                                    <label htmlFor="repeatPasswordInput" className="block text-sm font-medium text-gray-700">
                                        Repita a senha
                                    </label>
                                    <input
                                        type="password"
                                        name="repeatPassword"
                                        id="repeatPasswordInput"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        autoComplete='off'
                                        value={repeatPassword}
                                        onChange={handleRepeatPasswordChange}
                                    />
                                    {repeatPasswordErrorMessage &&
                                        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                            {repeatPasswordErrorMessage}
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:flex-column sm:flex-column-reverse sm:px-6">
                            <button
                                className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                onClick={() => onResetPasswordClick()}
                                disabled={isLoading}
                            >
                                {isLoading &&
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-indigo-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                }
                                Redefinir senha
                            </button>
                            <button
                                className="mt-2 w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-indigo-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                onClick={hideResetPasswordModal}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
