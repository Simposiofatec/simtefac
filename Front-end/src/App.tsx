import { createContext, useEffect, useState } from 'react';
import { Parameters } from './models/parameters.model';
import './App.css';
import { getParameters } from './services/parameters.service';
import { User } from './models/user.model';
import { Event } from './models/event.model';
import { getSelfUser } from './services/user.service';
import axios from 'axios';
import { setJWT } from './services/authentication.service';
import { getEvents } from './services/event.service';
import { getSubscriptionsFromSelfUser as getSelfUserSubscriptions } from './services/subscription.service';
import { TopBar } from './components/top-bar.component';
import { HashRouter } from "react-router-dom";
import { Subscription } from './models/subscription.model';
import ParametrizacaoIniacial from '../src/modals/ParametrosInicial';
import { isNullOrUndefined } from 'html5-qrcode/esm/core';

export const ParametersContext = createContext<Parameters | undefined>(undefined);
export const UserContext = createContext<User | undefined>(undefined);
export const SubscriptionsContext = createContext<Subscription[] | undefined>(undefined);
export const EventContext = createContext<Event[] | undefined>(undefined);

export const RefreshFunctionsContext = createContext<any>(undefined);
export const AuthenticationModalsContext = createContext<any>(undefined);

function App() {
  const [parametersData, setParameters] = useState<Parameters | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [subscriptions, setSubscriptions] = useState<Subscription[] | undefined>(undefined);
  const [events, setEvents] = useState<Event[] | undefined>(undefined);

  const [isParametrizacaoInicialModalOpen, setIsParametrizacaoInicialModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isPasswordRecoveryModalOpen, setIsPasswordRecoveryModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  function clearUser() {
    setUser(undefined);
  }

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);

        const params = await getParameters();
        setParameters(params);

        if (localStorage.getItem('token')) {
          const userData = await getSelfUser();
          setUser(userData);

          const subs = await getSelfUserSubscriptions();
          setSubscriptions(subs);
        } else {
          setUser(undefined);
          setSubscriptions(undefined);
        }

        const eventsData = await getEvents();
        setEvents(eventsData);

      } catch (error) {
        console.error("Erro no carregamento inicial", error);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, []);

  useEffect(() => {
    if (isNullOrUndefined(parametersData?.eventsStart)) {
      setIsParametrizacaoInicialModalOpen(true);
    } else {
      setIsParametrizacaoInicialModalOpen(false);
    }
  }, [parametersData]);

  function hideParametrizacaoInicialModal() {
    setIsParametrizacaoInicialModalOpen(false);
  }

  function refreshEvents() {
    return new Promise((resolve, reject) => {
      getEvents().then(events => {
        setEvents(events);
        resolve(events);
      }).catch(error => {
        reject(error);
      });
    });
  }

  function refreshSubscriptions() {
    return new Promise((resolve, reject) => {
      if (!user) {
        setSubscriptions(undefined);
        resolve(undefined);
        return;
      }

      getSelfUserSubscriptions().then(subscriptions => {
        setSubscriptions(subscriptions);
        resolve(subscriptions);
      }).catch(error => {
        setSubscriptions(undefined);
        reject(undefined);
      });
    });
  }

  function refreshUser() {
    getSelfUser().then(user => {
      setUser(user);
    })
      .catch((error) => {
        showSignInModal();
      });
  }

  function showSignInModal() {
    setIsSignUpModalOpen(false);
    setIsPasswordRecoveryModalOpen(false);
    setIsResetPasswordModalOpen(false);
    setIsSignInModalOpen(true);
  }

  function hideSignInModal() {
    setIsSignInModalOpen(false);
  }

  function showSignUpModal() {
    setIsSignInModalOpen(false);
    setIsPasswordRecoveryModalOpen(false);
    setIsResetPasswordModalOpen(false);
    setIsSignUpModalOpen(true);

  }

  function hideSignUpModal() {
    setIsSignUpModalOpen(false);
  }
 
  function showPasswordRecoveyModal() {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(false);
    setIsResetPasswordModalOpen(false);
    setIsPasswordRecoveryModalOpen(true);
  }

  function hidePasswordRecoveryModal() {
    setIsPasswordRecoveryModalOpen(false);
  }

  function showResetPasswordModal() {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(false);
    setIsPasswordRecoveryModalOpen(false);
    setIsResetPasswordModalOpen(true);
  }

  function hideResetPasswordModal() {
    setIsResetPasswordModalOpen(false);
  }

  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token || undefined;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(function (config) {
    return config;
  }, function (error) {
    if (error.response && error.response.status === 401) {
      showSignInModal();
    }
    console.log(error)
    return Promise.reject(error);
  })

  axios.interceptors.response.use(function (config) {
    const newToken = config.headers['authorization'];
    if (newToken)
      setJWT(newToken);
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  useEffect(() => {
    setIsResetPasswordModalOpen(window.location.hash === '#RecuperacaoDeSenha');
  }, []);

  useEffect(() => {
    refreshSubscriptions();
  }, [user]);

  if (loading) {
    return (
      <div className='bg-slate-800'>
      <div className="loading-screen bg-slate-800">
        Carregando... ⏳
      </div>
      </div>
    );
  }

  return (
    <>
      <ParametersContext.Provider value={parametersData}>
        <UserContext.Provider value={user}>
          <SubscriptionsContext.Provider value={subscriptions}>
            <RefreshFunctionsContext.Provider value={{ refreshSubscriptions, clearUser, refreshUser, refreshEvents }}>
              <AuthenticationModalsContext.Provider value={{ isSignInModalOpen, isSignUpModalOpen, isPasswordRecoveryModalOpen, isResetPasswordModalOpen, showSignInModal, showSignUpModal, showPasswordRecoveyModal, showResetPasswordModal, hideSignInModal, hideSignUpModal, hidePasswordRecoveryModal, hideResetPasswordModal }}>
                <EventContext.Provider value={events}>
                  <HashRouter>
                    <TopBar />
                  </HashRouter>
                </EventContext.Provider>
              </AuthenticationModalsContext.Provider>
            </RefreshFunctionsContext.Provider>
          </SubscriptionsContext.Provider>
        </UserContext.Provider>
      </ParametersContext.Provider>

      <ParametrizacaoIniacial //isso abre o modal de parametros iniciais caso necessario
        isOpen={isParametrizacaoInicialModalOpen}
        onClose={hideParametrizacaoInicialModal}
      />
    </>
  );
}

export default App;
