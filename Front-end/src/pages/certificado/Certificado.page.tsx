import React, { useContext, useState } from "react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import Mammoth from "mammoth";
import { UserContext } from "../../App";
import { User } from "../../models/user.model";

export function CertificadoPdf() {
  const [file, setFile] = useState<File | null>(null);
  const user = useContext<User | undefined>(UserContext);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };


  const processWordFile = async () => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) return;

      try {
        // Usa Mammoth para extrair o texto do arquivo .docx
        const result = await Mammoth.extractRawText({ arrayBuffer: event.target.result as ArrayBuffer });
        let text = result.value;

        // Substitui <NOME_ALUNO> pelo nome do aluno
        text = text.replace(/<NOME_ALUNO>/g, user.name);

        // Cria um PDF com a orientação horizontal (paisagem)
        const doc = new jsPDF("landscape");

        // Define o tamanho da fonte para garantir que o texto caiba
        let fontSize = 12;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);

        // Definindo margens
        const margin = 10;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // Ajustando o texto para que se ajuste automaticamente e não ultrapasse
        let x = margin;
        let y = margin;
        const lineHeight = fontSize * 1.5; // Distância entre as linhas

        // Quebra o texto em várias linhas, ajustando a largura da página
        const maxWidth = pageWidth - 2 * margin; // Largura disponível para o texto
        const lines = doc.splitTextToSize(text, maxWidth); // Divide o texto para caber na largura

        // Escreve cada linha de texto no PDF
        for (let i = 0; i < lines.length; i++) {
          if (y + lineHeight > pageHeight - margin) {
            doc.addPage(); // Cria uma nova página se o conteúdo ultrapassar o limite
            y = margin; // Reseta a posição Y na nova página
          }
          doc.text(lines[i], x, y);
          y += lineHeight;
        }

        // Gera o PDF e disponibiliza o download
        const pdfBlob = doc.output("blob");
        saveAs(pdfBlob, "certificado.pdf");
      } catch (error) {
        console.error("Erro ao processar o arquivo:", error);
        alert("Erro ao processar o arquivo. Certifique-se de que ele está no formato correto.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Gerador de Certificado PDF</h1>

      <input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="mb-2"
      />

      <button
        onClick={processWordFile}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Gerar PDF
      </button>
    </div>
  );
}
