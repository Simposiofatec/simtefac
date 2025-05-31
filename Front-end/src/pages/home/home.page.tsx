import LogoSimtefac from "../../assets/LogoSimtefac.svg";
import styles from "./home.module.css";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ParametersContext } from "../../App";
import { Parameters } from "../../models/parameters.model";
import { getParameters } from "../../services/parameters.service";
import { meses } from "./home.interfaces";
import inf from "../../data/Inf.json"

export function Home() {
  const parameters = useContext<Parameters | undefined>(ParametersContext);
  const bIsBeforeSubscriptionDate: boolean =
    parameters !== undefined &&
    parameters.subscriptionsStart.getTime() > new Date().getTime();
  const bIsAfterSubscriptionDate: boolean =
    parameters !== undefined &&
    parameters.subscriptionsEnd.getTime() < new Date().getTime();


const mesEvento = parameters
  ? meses[parameters.eventsStart.getMonth()]
  : "";

  return (
    <div className={styles.main}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <div>
            <div className={styles.title}>
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">{parameters?.eventsStart.getDate()} A {parameters?.eventsEnd.getDate()} DE {mesEvento.toUpperCase()}</div>
              <span>
                {inf.AnosFatec} ANOS CONECTANDO <span style={{color:"#D8B4FE"}}>CONHECIMENTO</span>, <span style={{color:"#F3A3D4"}}>TECNOLOGIA</span> <div style={{color:"#93C5F5"}}>E SUCESSO PROFISSIONAL</div>
              </span>
            </div>
            <NavLink to={"/Programacao"} className="w-full h-fit mt-10">
              <button
                className="w-full justify-center rounded-md border border-transparent enabled:bg-violet-500 py-2 px-4 text-sm font-medium text-white enabled:hover:bg-violet-800 enabled:focus:outline-none enabled:focus:ring-2 enabled:focus:ring-indigo-500 enabled:focus:ring-offset-2 disabled:bg-trasnparent"
                onClick={() => {}}
                disabled={bIsBeforeSubscriptionDate || bIsAfterSubscriptionDate}
              >
                {bIsBeforeSubscriptionDate
                  ? "Inscrições fechadas"
                  : bIsAfterSubscriptionDate
                  ? "Inscrições encerradas"
                  : "Faça sua inscrição!"}
              </button>
            </NavLink>
          </div>
          <div className={`${styles.line}`}></div>
          <img src={LogoSimtefac} alt="Fatec Catanduva"></img>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <h2 className={`${styles.description_title}`}>Sobre o <span style={{color:"#C084FC"}}>SIMTEFAC CATANDUVA</span></h2>
        <p className={`${styles.description}`}>
          O {inf.numeroSimposio}º Simpósio Fatec Catanduva ocorrerá entre os dias {parameters?.eventsStart.getDate()} e {parameters?.eventsEnd.getDate()} de {mesEvento} de {parameters?.eventsEnd.getFullYear()} de forma presencial exclusivamente para os alunos da
          Fatec Catanduva. A Fatec Catanduva procura proporcionar aos alunos
          conhecimento extra para a vida profissional, agregando conhecimento e
          troca de experiência com profissionais de diferentes áreas por meio de
          palestras, oficinas e minicursos, bem como com os projetos
          interdisciplinares.
        </p>
        <br />
        <p className={`${styles.description}`}>
          O evento acontecerá presencialmente nos diversos ambientes da FATEC
          Catanduva e alguns parceiros. Os ingressos deverão ser adquiridos de
          forma individual para cada evento o qual forem participar, e será
          disponível para os alunos que realizarem a inscrição através desse
          site. Devendo ser apresentado o QRCode, na portaria de cada palestra.
        </p>
        <br />
        <p className={`${styles.description}`}>
          Caso tenha alguma dúvida ou problema, entre em contato conosco pelo
          e-mail <b style={{color:"#C084FC"}}>{inf.email}</b>.
        </p>
      </div>
    </div>
  );
}
