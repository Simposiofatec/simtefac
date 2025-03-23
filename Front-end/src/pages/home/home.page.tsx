import LogoSimtefacDourada from '../../assets/LogoSimtefacDourada.svg';
import Fatec15Anos from '../../assets/Fatec15Anos.png';
import styles from './home.module.css';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { ParametersContext } from '../../App';
import { Parameters } from '../../models/parameters.model';


export function Home() {

    const parameters = useContext<Parameters | undefined>(ParametersContext);

    const bIsBeforeSubscriptionDate: boolean = parameters !== undefined && parameters.subscriptionsStart.getTime() > new Date().getTime();
    const bIsAfterSubscriptionDate: boolean = parameters !== undefined && parameters.subscriptionsEnd.getTime() < new Date().getTime();

    return (
        <div className={styles.main}>
            <img
                src={Fatec15Anos}
                className={styles.Fatec15Anos}
                alt={'Fatec 15 anos'}
            ></img>
            <div className={styles.banner}>
                <div className={styles.content}>
                    <div>
                        <span>21 A 24 DE NOVEMBRO</span>
                        <span>15 ANOS CONECTANDO CONHECIMENTO, TECNOLOGIA E SUCESSO PROFISSIONAL</span>
                        <NavLink
                            to={'/Programacao'}
                            className="w-full h-fit mt-10"
                        >
                            <button
                                className="w-full justify-center rounded-md border border-transparent enabled:bg-indigo-600 py-2 px-4 text-sm font-medium text-white enabled:hover:bg-indigo-700 enabled:focus:outline-none enabled:focus:ring-2 enabled:focus:ring-indigo-500 enabled:focus:ring-offset-2 disabled:bg-trasnparent"
                                onClick={() => { }}
                                disabled={bIsBeforeSubscriptionDate || bIsAfterSubscriptionDate}
                            >
                                {bIsBeforeSubscriptionDate ? 'Inscrições fechadas' : bIsAfterSubscriptionDate ? 'Inscrições encerradas' : 'Faça sua inscrição!' }
                            </button>
                        </NavLink>
                    </div>
                    <div className={styles.line}></div>
                    <img
                        src={LogoSimtefacDourada}
                        alt="Fatec Catanduva"
                    >
                    </img>
                </div>
            </div>
            <div className={`${styles.content}`}>
                <p className={`${styles.description}`}>O 27º Simpósio Fatec Catanduva ocorrerá entre os dias 21 e 24 de Novembro de 2023 de forma presencial exclusivamente para os alunos da Fatec Catanduva. A Fatec Catanduva procura proporcionar aos alunos conhecimento extra para a vida profissional, agregando conhecimento e troca de experiência com profissionais de diferentes áreas por meio de palestras, oficinas e minicursos, bem como com os projetos interdisciplinares.</p>
                <br />
                <p className={`${styles.description}`}>O evento acontecerá presencialmente nos diversos ambientes da FATEC Catanduva e alguns parceiros. Os ingressos deverão ser adquiridos de forma individual para cada evento o qual forem participar, e será disponível para os alunos que realizarem a inscrição através desse site. Devendo ser apresentado o QRCode, na portaria de cada palestra.</p>
                <br />
                <p className={`${styles.description}`}>Caso tenha alguma dúvida ou problema, entre em contato conosco pelo e-mail <b>simposio@fateccatanduva.edu.br</b>.</p>
            </div>
        </div>
    )
}
