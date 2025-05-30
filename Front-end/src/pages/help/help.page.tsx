import styles from './help.module.css'
import inf from "../../data/Inf.json"
export function Help() {
    return (
        <div className={styles.main}>
            <div className={`${styles.content}`}>
                <div className={`${styles.content_header}`}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#c79bff" stroke-width="2"></path> <path d="M10.5 8.67709C10.8665 8.26188 11.4027 8 12 8C13.1046 8 14 8.89543 14 10C14 10.9337 13.3601 11.718 12.4949 11.9383C12.2273 12.0064 12 12.2239 12 12.5V12.5V13" stroke="#c79bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 16H12.01" stroke="#c79bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    <h2>Central de Ajuda</h2>
                </div>
                <div className={`${styles.help_card}`}>
                    <div className={`${styles.title_icon}`}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 9H21M9 15L11 17L15 13M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#c79bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>                        
                        <h3 className={`${styles.title}`}>Como realizar sua inscrição</h3>
                    </div>
                    <p className={`${styles.description}`}>Antes de realizar sua inscrição, você deve se cadastrar utilizando seu e-mail institucional (nome.sobrenome@fatec.sp.gov.br). Após o cadastro, vá à página "Programação", escolha a palestra que deseja participar e clique em "Inscrever-se".</p>
                    <ul>
                        <li><b>Só é possível se inscrever em uma palestra por dia.</b></li>
                        <li><b>As inscrições nos trabalhos Interdisciplinares são feitas de forma automática.</b></li>
                    </ul>
                </div>
                <div className={`${styles.help_card}`}>
                    <div className={`${styles.title_icon}`}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.6311 7.15517C15.9018 7.05482 16.1945 7 16.5001 7C17.8808 7 19.0001 8.11929 19.0001 9.5C19.0001 10.8807 17.8808 12 16.5001 12C16.1945 12 15.9018 11.9452 15.6311 11.8448" stroke="#c79bff" stroke-width="2" stroke-linecap="round"></path> <path d="M3 19C3.69137 16.6928 5.46998 16 9.5 16C13.53 16 15.3086 16.6928 16 19" stroke="#c79bff" stroke-width="2" stroke-linecap="round"></path> <path d="M17 15C19.403 15.095 20.5292 15.6383 21 17" stroke="#c79bff" stroke-width="2" stroke-linecap="round"></path> <path d="M13 9.5C13 11.433 11.433 13 9.5 13C7.567 13 6 11.433 6 9.5C6 7.567 7.567 6 9.5 6C11.433 6 13 7.567 13 9.5Z" stroke="#c79bff" stroke-width="2"></path> </g></svg>
                        <h3 className={`${styles.title}`}>Interdisciplinares</h3>
                    </div>
                    <p className={`${styles.description}`}>As inscrições nos trabalhos Interdisciplinares são feitas de forma automática. Caso você não esteja inscrito em seu Interdisciplinar, entre em contato conosco.</p>
                </div>
                <div className={`${styles.help_card}`}>
                    <div className={`${styles.title_icon}`}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.0834 20.9262 20.3009 20.9103 20.499 20.7963C20.663 20.7019 20.8185 20.5345 20.9007 20.364C21 20.1582 21 19.9181 21 19.438V16.6207C21 16.2169 21 16.015 20.9335 15.842C20.8749 15.6891 20.7795 15.553 20.6559 15.4456C20.516 15.324 20.3262 15.255 19.9468 15.117L16.74 13.9509C16.2985 13.7904 16.0777 13.7101 15.8683 13.7237C15.6836 13.7357 15.5059 13.7988 15.3549 13.9058C15.1837 14.0271 15.0629 14.2285 14.8212 14.6314L14 16C11.3501 14.7999 9.2019 12.6489 8 10L9.36863 9.17882C9.77145 8.93713 9.97286 8.81628 10.0942 8.64506C10.2012 8.49408 10.2643 8.31637 10.2763 8.1317C10.2899 7.92227 10.2096 7.70153 10.0491 7.26005L8.88299 4.05321C8.745 3.67376 8.67601 3.48403 8.55442 3.3441C8.44701 3.22049 8.31089 3.12515 8.15802 3.06645C7.98496 3 7.78308 3 7.37932 3H4.56201C4.08188 3 3.84181 3 3.63598 3.09925C3.4655 3.18146 3.29814 3.33701 3.2037 3.50103C3.08968 3.69907 3.07375 3.91662 3.04189 4.35173C3.01413 4.73086 3 5.11378 3 5.5Z" stroke="#c79bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <h3 className={`${styles.title}`}>Contato</h3>
                    </div>
                    <p className={`${styles.description}`}>Caso tenha alguma dúvida ou problema, entre em contato conosco pelo e-mail <b style={{color:"#D8ABEB"}}>{inf.email}</b>.</p>
                </div>
            </div>
        </div>
    );
}