import React, { useEffect, useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

interface FilterSectionProps {
  filters: {
    train: string;
    period: string;
    line: string;
  };
  setFilters: (filters: any) => void;
}

export function FilterSection({ filters, setFilters }: FilterSectionProps) {
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [treni, setTreni] = useState<Array<{ linea: string; nome_treno: string; treno_id: number }>>([]);
  const [loadingTreni, setLoadingTreni] = useState(false);
  const [treniError, setTreniError] = useState<string | null>(null);

  // Load trains list from API
  useEffect(() => {
    let mounted = true;
    async function loadTreni() {
      setLoadingTreni(true);
      setTreniError(null);
      try {
        const res = await fetch('http://127.0.0.1:5000/treni');
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        if (!mounted) return;
        setTreni(json);
        // If no train selected yet, pick the first
        if (!filters.train && Array.isArray(json) && json.length > 0) {
          setFilters({ ...filters, train: String(json[0].treno_id) });
        }
      } catch (err: any) {
        if (!mounted) return;
        setTreniError(err?.message ?? String(err));
      } finally {
        if (mounted) setLoadingTreni(false);
      }
    }

    loadTreni();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-gray-900 mb-4">Filtri</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Treno Dropdown */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Treno</label>
          <div className="relative">
            {loadingTreni ? (
              <div className="w-full rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500">Caricamento treni...</div>
            ) : treniError ? (
              <div className="w-full rounded-lg px-4 py-2.5 bg-red-50 text-red-600">Errore caricamento treni: {treniError}</div>
            ) : (
              <select
                value={filters.train}
                onChange={(e) => setFilters({ ...filters, train: e.target.value })}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {treni.length === 0 ? (
                  <option value="">Nessun treno disponibile</option>
                ) : (
                  treni.map((t) => (
                    <option key={t.treno_id} value={String(t.treno_id)}>{`${t.linea} - ${t.nome_treno}`}</option>
                  ))
                )}
              </select>
            )}

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Periodo Dropdown */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">Periodo di tempo</label>
          <div className="relative">
            <select
              value={filters.period}
              onChange={(e) => {
                setFilters({ ...filters, period: e.target.value });
                setShowCustomDate(e.target.value === 'Personalizzato');
              }}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Oggi</option>
              <option>Ultima settimana</option>
              <option>Ultimo mese</option>
              <option>Personalizzato</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {showCustomDate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Data inizio</label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Data fine</label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}