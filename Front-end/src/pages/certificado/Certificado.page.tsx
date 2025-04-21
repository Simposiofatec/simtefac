import React, { useContext, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import Mammoth from "mammoth";
import { UserContext } from "../../App";
import { User } from "../../models/user.model";
import { GetCertificado, GetPresencas, GetPresencaCertificado } from "../../services/certificate.service";

export function CertificadoPdf() {
  const [file, setFile] = useState<File | null>(null);
  const user = useContext(UserContext);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [presencas, setPresencas] = useState<number | null>(null);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Gerador de Certificado PDF</h1>

      <button onClick={processWordFile} className="bg-blue-500 text-white px-4 py-2 rounded">
        Gerar PDF
      </button>
    </div>
  );
}
