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

  /**
   * @summary Carrega o arquivo .docx diretamente da pasta public/files
   */
  useEffect(() => {
    async function fetchCertificado() {
        try {
            const blob = await GetCertificado(); // Chama a função sem passar o eventId
            
            // Converte o Blob para File
            const file = new File([blob], 'Certificado.docx', { type: blob.type });
            
            setFile(file); // Armazena o arquivo no estado
        } catch (error) {
            console.error('Erro ao baixar o certificado:', error);
        }
    }

    fetchCertificado(); // Faz a chamada para a API quando o componente for montado

}, []); // O useEffect roda apenas uma vez, ao montar o componente
  



  const processWordFile = async () => {
    if (!usuario) {
      alert("Usuário não encontrado!");
      return;
    }

    if (!file) {
      alert("Selecione um arquivo antes de gerar o PDF.");
      return;
    }
    console.log(presencas)
    if(presencas == null || presencas < 4){
      alert("Você não possui a quantidade necessarias de presença")
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) return;

      try {
        const result = await Mammoth.extractRawText({ arrayBuffer: event.target.result as ArrayBuffer });
        let text = result.value;

        text = text.replace(/<NOME_ALUNO>/g, usuario.name); // Usa 'usuario' em vez de 'user'

        const doc = new jsPDF("landscape");
        let fontSize = 12;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);

        const margin = 10;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        let x = margin;
        let y = margin;
        const lineHeight = fontSize * 1.5;
        const maxWidth = pageWidth - 2 * margin;
        const lines = doc.splitTextToSize(text, maxWidth);

        for (let i = 0; i < lines.length; i++) {
          if (y + lineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(lines[i], x, y);
          y += lineHeight;
        }

        const pdfBlob = doc.output("blob");
        saveAs(pdfBlob, "certificado.pdf");
      } catch (error) {
        console.error("Erro ao processar o arquivo:", error);
        alert("Erro ao processar o arquivo. Certifique-se de que ele está no formato correto.");
      }
    };

    reader.readAsArrayBuffer(file);
      await GetPresencaCertificado(usuario.email.toString());

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
