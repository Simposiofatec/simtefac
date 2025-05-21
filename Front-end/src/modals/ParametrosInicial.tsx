import { useState } from "react";
import { saveParameters } from "../services/parameters.service";

interface Parameters {
  version: string;
  subscriptionsStart: Date;
  subscriptionsEnd: Date;
  eventsStart: Date;
  eventsEnd: Date;
  eventDuration: number;
}

export default function ParametrizacaoInicial({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Aqui o estado é string porque é o que o input retorna
  const [parametrosForm, setParametrosForm] = useState({
    version: "1.0.0",
    subscriptionsStart: "",
    subscriptionsEnd: "",
    eventsStart: "",
    eventsEnd: "",
    eventDuration: "", // vai ser string no input, depois converte pra number
  });

  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setParametrosForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave() {
    // converte o estado string para os tipos da interface
    const parametrosToSave: Parameters = {
      version: parametrosForm.version,
      subscriptionsStart: new Date(parametrosForm.subscriptionsStart),
      subscriptionsEnd: new Date(parametrosForm.subscriptionsEnd),
      eventsStart: new Date(parametrosForm.eventsStart),
      eventsEnd: new Date(parametrosForm.eventsEnd),
      eventDuration: Number(parametrosForm.eventDuration),
    };

    saveParameters(parametrosToSave)
      .then(() => onClose())
      .catch((err) => console.error("Erro ao salvar:", err));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-3xl shadow-lg w-full max-w-7xl">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-100">
          Parametrização Inicial
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Versão
            </label>
            <input
              name="version"
              disabled
              value={parametrosForm.version}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full border border-gray-700 bg-gray-700 text-gray-300 rounded-md p-2 cursor-not-allowed"
              placeholder="Digite a versão..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100">
              Início das inscrições
            </label>
            <input
              name="subscriptionsStart"
              value={parametrosForm.subscriptionsStart}
              onChange={handleChange}
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100">
              Fim das inscrições
            </label>
            <input
              name="subscriptionsEnd"
              value={parametrosForm.subscriptionsEnd}
              onChange={handleChange}
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100">
              Início do evento
            </label>
            <input
              name="eventsStart"
              value={parametrosForm.eventsStart}
              onChange={handleChange}
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100">
              Fim do evento
            </label>
            <input
              name="eventsEnd"
              value={parametrosForm.eventsEnd}
              onChange={handleChange}
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100">
              Duração do evento (em dias)
            </label>
            <input
              name="eventDuration"
              value={parametrosForm.eventDuration}
              onChange={handleChange}
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Ex: 4"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
