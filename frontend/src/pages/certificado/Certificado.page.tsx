import React, { useContext, useEffect, useState } from "react";
import { ParametersContext, UserContext } from "../../App";
import { User } from "../../models/user.model";
import { Parameters } from "../../models/parameters.model"
import { GetCertificado, GetPresencas, GetPresencaCertificado } from "../../services/certificate.service";


export function CertificadoPdf() {
  const user = useContext(UserContext);
  const parameters = useContext(ParametersContext);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [presencas, setPresencas] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<Parameters | null>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  /**
 * @summary Resgata o usuario logado e insere ele no usuario
 * @description Isso foi feito para evitar erro de undefined que ocorria
 * @returns {User} esse useEffect retorna o usuario logado
 */
  useEffect(() => {
    if (user) {
      setUsuario(user); 
    } else {
      console.warn("Usuário não definido!");
    }
  }, [user]);

  useEffect(() => {
  async function presencasFunction(){
    if(parameters){
      setDuration(parameters)
    }else{
      setDuration(null);
    }
    try{
    if(user){
      const presencas = await GetPresencas(user.email.toString());
      setPresencas(presencas)
  }
}catch{

}
  }

presencasFunction();
  }, [user])

  const processWordFile = async () => {
    if (!usuario) {
      alert("Usuário não encontrado!");
      return;
    }

    if (!duration || presencas == null || presencas < duration.eventDuration-1) {
      alert("Você não possui a quantidade necessária de presenças.");
      return;
    }
  
    try {
      // Gera e baixa o certificado do backend
      const certificadoBlob = await GetCertificado(usuario.email);
  
      const url = window.URL.createObjectURL(certificadoBlob);
      setPdfUrl(url);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificado.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Atualiza presença no sistema (se necessário)
      await GetPresencaCertificado(usuario.email.toString());
    } catch (error) {
      console.error("Erro ao gerar o certificado:", error);
      alert("Erro ao gerar o certificado. Tente novamente.");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-4">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold text-white mb-1">Gerar Certificado</h1>
        <div className="mt-2 text-sm text-white italic">
          {!pdfUrl ? (
            <p>Você deve possuir mais de 75% de presença para que o certificado seja gerado</p>):
            <p>Certificado gerado com sucesso ✔️</p>
          }
        </div>
      </div>
        {pdfUrl && (
        isMobile ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
          >
            Visualizar Certificado
          </a>
        ) : (
          <iframe
            src={pdfUrl}
            className="w-full max-w-4xl h-[70vh] border rounded shadow"
          />
        )
      )}

      <div className="mt-2">
      <button 
        onClick={processWordFile} 
        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition duration-300">
        Gerar PDF
      </button>
      </div>
    </div>
  );
  
}
