import { useContext, useState } from "react";
import { signIn } from "../services/authentication.service";
import { ToasterError } from "../helpers/toastr";
import { AuthenticationModalsContext, RefreshFunctionsContext } from "../App";

export function SignInModal(props: any) {
    const { showSignUpModal, hideSignInModal, showPasswordRecoveyModal } = useContext<any>(AuthenticationModalsContext);
    const { refreshUser } = useContext<any>(RefreshFunctionsContext);

    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onRecoverPasswordClick = () => {
        showPasswordRecoveyModal();
    }

    const onSignInClick = () => {
        let hasError = false;
        setLoginErrorMessage('');
        setPasswordErrorMessage('');
        setIsLoading(true);

        if (!login.trim()) {
            setLoginErrorMessage('Este campo deve ser preenchido.');
            hasError = true;
        }

        if (!password) {
            setPasswordErrorMessage('Este campo deve ser preenchido.');
            hasError = true;
        }

        if (hasError) {
            setIsLoading(false);
            return;
        }


        signIn(login, password)
            .then(() => {
                refreshUser();
                hideSignInModal();
            })
            .catch(error => {
                setIsLoading(false);
                if (error.response) {
                    const responseMessage = error.response.data.message;
                    const internalCode = error.response.data.internalCode

                    if (internalCode === 2) {
                        setLoginErrorMessage('E-Mail não encontrado. (Lembre-se de se cadastrar clicando em "Cadastrar" antes de entrar)');
                    }
                    else if (internalCode === 6) {
                        setPasswordErrorMessage('Senha incorreta.');
                    }
                    else if (error.response.data.message) {
                        if (responseMessage) {
                            ToasterError(responseMessage);
                        }
                    }
                    else {
                        ToasterError('Ocorreu um erro inesperado durante a autenticação.');
                    }
                }
                else {
                    ToasterError('Ocorreu um erro inesperado durante a autenticação.');
                }
            });
    }
    const onRegisterClick = () => {
        hideSignInModal();
        showSignUpModal();
    }

    const handleLoginChange = (event: any) => {
        setLogin(event.target.value);
    }
    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    }

    return (
        <div
            className="relative z-10"
            onClick={hideSignInModal}
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
                                    <label htmlFor="loginInput" className="block text-sm font-medium text-gray-700">
                                        E-Mail Institucional
                                    </label>
                                    <input
                                        type="text"
                                        name="login"
                                        id="loginInput"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        autoComplete='off'
                                        value={login}
                                        onChange={handleLoginChange}
                                        placeholder='nome.sobrenome@fatec.sp.gov.br'
                                    />
                                    {loginErrorMessage &&
                                        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                            {loginErrorMessage}
                                        </span>
                                    }
                                </div>
                                <div className="col-span-6 sm:col-span-3 text-left">
                                    <label htmlFor="passwordInput" className="block text-sm font-medium text-gray-700">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        name="login"
                                        id="passwordInput"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        autoComplete='off'
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                {passwordErrorMessage &&
                                    <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                                        {passwordErrorMessage}
                                    </span>
                                }
                                <div className="flex flex-row justify-end text-sm mt-2">
                                    <button
                                        onClick={() => onRecoverPasswordClick()}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Esqueceu a senha?
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:flex-column sm:flex-column-reverse sm:px-6">
                            <button
                                className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                onClick={() => onSignInClick()}
                                disabled={isLoading}
                            >
                                {isLoading &&
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-indigo-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                }
                                Entrar
                            </button>
                            <button
                                className="mt-2 w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-indigo-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => onRegisterClick()}
                            >
                                Cadastrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}