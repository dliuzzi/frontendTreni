import React from 'react';
import { FileSpreadsheet, FileText, Image } from 'lucide-react';

export function ExportSection() {
  const handleExport = (format: string) => {
    // Mock export functionality
    alert(`Esportazione ${format} avviata!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Esportazione Dati</h2>
        <p className="text-sm text-gray-500">Scarica i dati in diversi formati</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleExport('CSV')}
          className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-left">
            <div className="text-gray-900">Esporta CSV</div>
            <div className="text-xs text-gray-500">File dati tabulari</div>
          </div>
        </button>

        <button
          onClick={() => handleExport('Excel')}
          className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="text-gray-900">Esporta Excel</div>
            <div className="text-xs text-gray-500">Foglio di calcolo</div>
          </div>
        </button>

        <button
          onClick={() => handleExport('Grafico PNG/PDF')}
          className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Image className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="text-gray-900">Esporta Grafico</div>
            <div className="text-xs text-gray-500">PNG o PDF</div>
          </div>
        </button>
      </div>
    </div>
  );
}
