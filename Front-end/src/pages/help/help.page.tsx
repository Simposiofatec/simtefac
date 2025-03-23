import styles from './help.module.css'
export function Help() {
    return (
        <div className={styles.main}>
            <div className={`${styles.content}`}>
                <div className='mb-20'>
                    <h3 className={`${styles.title}`}>Como realizar sua inscrição</h3>
                    <p className={`${styles.description}`}>Antes de realizar sua inscrição, você deve se cadastrar utilizando seu e-mail institucional (nome.sobrenome@fatec.sp.gov.br). Após o cadastro, vá à página "Programação", escolha a palestra que deseja participar e clique em "Inscrever-se".</p>
                    <ul>
                        <li><b>Só é possível se inscrever em uma palestra por dia.</b></li>
                        <li><b>As inscrições nos trabalhos Interdisciplinares são feitas de forma automática.</b></li>
                    </ul>
                </div>
                <div className='mb-20'>
                    <h3 className={`${styles.title}`}>Interdisciplinares</h3>
                    <p className={`${styles.description}`}>As inscrições nos trabalhos Interdisciplinares são feitas de forma automática. Caso você não esteja inscrito em seu Interdisciplinar, entre em contato conosco.</p>
                </div>
                <div>
                    <h3 className={`${styles.title}`}>Contato</h3>
                    <p className={`${styles.description}`}>Caso tenha alguma dúvida ou problema, entre em contato conosco pelo e-mail <b>simposio@fateccatanduva.edu.br</b>.</p>
                </div>
            </div>
        </div>
    );
}