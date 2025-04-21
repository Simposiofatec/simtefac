import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { User } from "../../models/user.model";
import { GetCertificado, GetPresencas, GetPresencaCertificado } from "../../services/certificate.service";


export function CertificadoPdf() {
  const user = useContext(UserContext);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [presencas, setPresencas] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
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
  
    if (presencas == null || presencas < 4) {
      alert("Você não possui a quantidade necessária de presenças.");
      return;
    }
  
    try {
      // Gera e baixa o certificado do backend
      const certificadoBlob = await GetCertificado(usuario.name);
  
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
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Gerar Certificado</h1>
        <div className="mt-2 text-sm text-gray-900 italic">
          {!pdfUrl ? (
            <p>Você deve possuir mais de 75% de presença para que o certificado seja gerado</p>):
            <p>Certificado gerado com sucesso ✔️</p>
          }
        </div>
      </div>
      {pdfUrl && (
        // eslint-disable-next-line jsx-a11y/iframe-has-title
        <iframe
          src={pdfUrl}
          className="mt-8 w-full max-w-4xl h-[80vh] border rounded shadow"
        />
      )}
      <div className="mt-2">
      <button 
        onClick={processWordFile} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition duration-300">
        Gerar PDF
      </button>
      </div>
    </div>
  );
  
}
