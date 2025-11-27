import React, { useMemo } from 'react';
import { FileSpreadsheet, FileText, Image } from 'lucide-react';

interface ExportSectionProps {
  train?: string;
  period?: string;
}

export function ExportSection({ train, period }: ExportSectionProps) {
  // map period labels to API durata values
  const mapPeriodToDurata = (p?: string) => {
    if (!p) return 'giorno';
    const value = p.toLowerCase();
    if (value.includes('oggi')) return 'giorno';
    if (value.includes('settimana')) return 'settimana';
    if (value.includes('mese')) return 'mese';
    return 'giorno';
  };

  // train should be the numeric treno_id string coming from /treni (e.g. "1001").
  const getTrainId = (trainValue?: string) => {
    if (!trainValue) return null;
    return /^[0-9]+$/.test(trainValue) ? trainValue : null;
  };

  const trenoId = useMemo(() => getTrainId(train), [train]);
  const durata = useMemo(() => mapPeriodToDurata(period), [period]);

  async function downloadFrom(url: string, filename: string) {
    try {
      // Use fetch so we can force a download and give better error messages
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      // fallback to opening URL and let browser handle it
      window.open(url, '_blank');
      console.error('Download failed, opened link instead:', err);
      alert(`Errore durante il download: ${err?.message ?? String(err)}`);
    }
  }

  const handleExport = (format: 'csv' | 'excel') => {
    if (!trenoId) {
      alert('Seleziona prima un treno valido per l\'esportazione.');
      return;
    }

    const endpoint = `http://127.0.0.1:5000/treno/${trenoId}/export/${format}?durata=${durata}`;
    const filename = `treno_${trenoId}_export_${durata}.${format === 'csv' ? 'csv' : 'xlsx'}`;
    void downloadFrom(endpoint, filename);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Esportazione Dati</h2>
        <p className="text-sm text-gray-500">Scarica i dati in diversi formati</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleExport('csv')}
          className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          disabled={!trenoId}
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
          onClick={() => handleExport('excel')}
          disabled={!trenoId}
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
      </div>
    </div>
  );
}
