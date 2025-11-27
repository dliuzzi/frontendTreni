import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', energy: 150 },
  { time: '02:00', energy: 2450 },
  { time: '04:00', energy: 4800 },
  { time: '06:00', energy: 6950 },
  { time: '08:00', energy: 9200 },
  { time: '10:00', energy: 11600 },
  { time: '12:00', energy: 14100 },
  { time: '14:00', energy: 16850 },
  { time: '16:00', energy: 19500 },
  { time: '18:00', energy: 22300 },
  { time: '20:00', energy: 24750 },
  { time: '22:00', energy: 27100 },
  { time: '24:00', energy: 29400 }
];

interface EnergyChartProps {
  train?: string;
  period?: string;
}

export function EnergyChart({ train, period }: EnergyChartProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Expect `train` to be the treno_id string coming from /treni (e.g. "1001").
  function getTrainId(trainValue?: string) {
    if (!trainValue) return null;
    if (!/^[0-9]+$/.test(trainValue)) return null;
    return trainValue;
  }

  function mapPeriodToDurata(periodLabel?: string) {
    if (!periodLabel) return 'giorno';
    const p = periodLabel.toLowerCase();
    if (p.includes('oggi')) return 'giorno';
    if (p.includes('settimana')) return 'settimana';
    if (p.includes('mese')) return 'mese';
    return 'giorno';
  }

  useEffect(() => {
    const id = getTrainId(train);
    const durata = mapPeriodToDurata(period);
    if (!id) {
      setImgSrc(null);
      setError(null);
      setLoading(false);
      return;
    }

    const url = `http://127.0.0.1:5000/treno/${id}/consumo?durata=${durata}`;
    let mounted = true;
    let objectUrl: string | null = null;

    async function fetchImage() {
      setLoading(true);
      setError(null);
      setImgSrc(null);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        if (mounted) setImgSrc(objectUrl);
      } catch (err: any) {
        if (mounted) setError(err?.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchImage();

    return () => {
      mounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [train, period]);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Consumo Energetico</h2>
        <p className="text-sm text-gray-500">Andamento del consumo energetico — se è selezionato un treno verrà mostrato il grafico lato server.</p>
      </div>

      {imgSrc ? (
        <div className="flex justify-center p-4 bg-white border border-gray-200 rounded-lg">
          <img src={imgSrc} alt={`Consumo treno`} className="max-h-[420px] w-full object-contain" />
        </div>
      ) : (
        <>
          {loading && <div className="text-sm text-gray-500 mb-2">Caricamento grafico consumo in corso…</div>}
          {error && <div className="text-sm text-red-600 mb-2">Impossibile caricare il grafico consumo: {error}</div>}

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Line 
            type="monotone" 
            dataKey="energy" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
