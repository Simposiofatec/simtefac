import { useContext, useRef, Fragment } from "react";
import { AuthenticationModalsContext, RefreshFunctionsContext, UserContext } from "../App";
import { User } from "../models/user.model";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import LogoFatec from '../assets/LogoFatec.svg';
import profileImage from '../assets/Profile.svg'
import { NavLink, Route, Routes } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { signOut } from "../services/authentication.service";
import { Home } from "../pages/home/home.page";
import { Schedule } from "../pages/schedule/schedule.page";
import { Help } from "../pages/help/help.page";
import { QRCode } from "../pages/qr-code.page";
import { SignInModal } from "../modals/sign-in.modal";
import { SignUpModal } from "../modals/sign-up.modal";
import { classNames } from "../helpers/stylingFunctions";
import { PasswordRecoveryModal } from "../modals/password-recovery.modal";
import { PasswordResetModal } from "../modals/password-reset.modal";
import AttendanceRecord from "../pages/attendance-recrod/attendance-record";
import { CertificadoPdf } from "../pages/certificado/Certificado.page";

export function TopBar(props: any) {
    const user = useContext<User | undefined>(UserContext);
    const { clearUser } = useContext<any>(RefreshFunctionsContext);
    const { isSignInModalOpen, isSignUpModalOpen, isPasswordRecoveryModalOpen, isResetPasswordModalOpen, showSignInModal, showSignUpModal } = useContext<any>(AuthenticationModalsContext);

    const navigation = [
        { name: 'Início', href: '/', showWhenUnauthorized: true, showWhenAuthorized: true },
        { name: 'Programação', href: '/Programacao', showWhenUnauthorized: true, showWhenAuthorized: true },
        { name: 'Meu QR Code', href: '/QRCode', showWhenUnauthorized: false, showWhenAuthorized: true },
        { name: 'Ajuda', href: '/Ajuda', showWhenUnauthorized: true, showWhenAuthorized: true },
        { name: "Certificado", href: '/Certificado', showWhenUnauthorized: false, showWhenAuthorized: true }
    ]

    const userNavigation = [
        { name: 'Sair', href: '#', showWhenUnauthorized: false, showWhenAuthorized: true, onClick: onLogoutClick },
        { name: 'Entrar', href: '#', showWhenUnauthorized: true, showWhenAuthorized: false, onClick: onSignInClick },
        { name: 'Cadastrar', href: '#', showWhenUnauthorized: true, showWhenAuthorized: false, onClick: onRegisterClick },
    ]

    function onSignInClick() {
        showSignInModal();
    }

    function onRegisterClick() {
        showSignUpModal();
    }

    function onLogoutClick() {
        signOut();
        clearUser();
    }

    const menuHamburgerButtonRef = useRef<any>(null);

    return (
        <div className="h-full" style={{
            display: 'flex',
            flexFlow: 'column'
        }
        }>
            <Disclosure as="nav" className="bg-gray-800" style={{
                boxShadow: 'var(--shadow-bottom-hard)',
                zIndex: 1,
                flex: '0 1 auto'
            }}>
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-10"
                                            src={LogoFatec}
                                            alt="Fatec Catanduva"
                                        />
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {navigation.filter((item) => (user && item.showWhenAuthorized) || (!user && item.showWhenUnauthorized)
                                            ).map((item, i) => (
                                                <NavLink
                                                    to={item.href}
                                                    key={i}
                                                    className={(state) => { return (state.isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white') + ' px-3 py-2 rounded-md text-sm font-medium' }}
                                                >
                                                    {item.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        {!user &&
                                            <>
                                                <button
                                                    key="Entrar"
                                                    onClick={onSignInClick}
                                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                                >
                                                    Entrar
                                                </button>
                                                <button
                                                    key="Cadastrar"
                                                    onClick={onRegisterClick}
                                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                                >
                                                    Cadastrar
                                                </button>
                                            </>
                                        }
                                        {user &&
                                            <Menu as="div" className="relative ml-3">
                                                <div className="flex">
                                                    <div className="ml-3 text-right mr-4">
                                                        <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                                        <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                                    </div>
                                                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="sr-only">Open user menu</span>
                                                        <img className="h-8 w-8 rounded-full" src={profileImage} alt="" />
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {userNavigation.filter(
                                                            (item) => (user && item.showWhenAuthorized) || (!user && item.showWhenUnauthorized)
                                                        ).map(
                                                            (item) =>
                                                            (
                                                                <Menu.Item key={item.name}>
                                                                    {({ active }) => (
                                                                        <a
                                                                            href={item.href}
                                                                            onClick={item.onClick}
                                                                            className={classNames(
                                                                                active ? 'bg-gray-100' : '',
                                                                                'block px-4 py-2 text-sm text-gray-700'
                                                                            )}
                                                                        >
                                                                            {item.name}
                                                                        </a>
                                                                    )}
                                                                </Menu.Item>
                                                            )
                                                        )}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        }
                                    </div>
                                </div>
                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        ref={menuHamburgerButtonRef}
                                    >
                                        <span className="sr-only">Expandir menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="md:hidden">
                            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                                {navigation.filter(
                                    (item) => (user && item.showWhenAuthorized) || (!user && item.showWhenUnauthorized)
                                ).map((item: any) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => {
                                            menuHamburgerButtonRef.current.click();
                                            navigation.forEach((auxItem: any) => { auxItem.current = false })
                                            item.current = true;
                                        }}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block px-3 py-2 rounded-md text-base font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                            <div className="border-t border-gray-700 pt-4 pb-3">
                                {user && (
                                    <div className="flex items-center px-5 mb-3">
                                        <div className="flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full" src={profileImage} alt="" />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                            <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-1 px-2">
                                    {userNavigation.filter(
                                        (item) => (user && item.showWhenAuthorized) || (!user && item.showWhenUnauthorized)
                                    ).map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            onClick={item.onClick}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <main style={{
                flexGrow: 1,
                overflowY: 'auto'
            }}>
                <Routes>
                    <Route path='/' element={<Home></Home>} />
                    <Route path="/Programacao" element={<Schedule></Schedule>} />
                    <Route path='/QRCode' element={<QRCode></QRCode>} />
                    <Route path='/Ajuda' element={<Help></Help>} />
                    <Route path='/RegistroDePresenca' element={<AttendanceRecord></AttendanceRecord>} />
                    <Route path='/Certificado' element={<CertificadoPdf></CertificadoPdf>} />

                    <Route path="*" element={<h1>Página não encontrada</h1>} />
                </Routes>
            </main>
            {isSignUpModalOpen && <SignUpModal></SignUpModal>}
            {isSignInModalOpen && <SignInModal></SignInModal>}
            {isPasswordRecoveryModalOpen && <PasswordRecoveryModal></PasswordRecoveryModal>}
            {isResetPasswordModalOpen && <PasswordResetModal></PasswordResetModal>}
        </div>
    )
}