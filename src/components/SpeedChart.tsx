import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', speed: 0 },
  { time: '02:00', speed: 85 },
  { time: '04:00', speed: 142 },
  { time: '06:00', speed: 168 },
  { time: '08:00', speed: 175 },
  { time: '10:00', speed: 155 },
  { time: '12:00', speed: 148 },
  { time: '14:00', speed: 162 },
  { time: '16:00', speed: 178 },
  { time: '18:00', speed: 145 },
  { time: '20:00', speed: 120 },
  { time: '22:00', speed: 95 },
  { time: '24:00', speed: 0 }
];

interface SpeedChartProps {
  train?: string; // e.g. "Treno 001"
  period?: string; // e.g. "Oggi", "Ultima settimana", "Ultimo mese"
}

export function SpeedChart({ train, period }: SpeedChartProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map filter text (from FilterSection) to API parameters
  function mapTrainToId(trainLabel?: string) {
    if (!trainLabel) return null;
    const match = trainLabel.match(/(\d+)/);
    const num = match ? parseInt(match[0], 10) : NaN;
    if (Number.isNaN(num)) return null;
    // If the passed number already looks like a full treno_id (>= 1000), return it
    if (num >= 1000) return String(num);
    // Handle legacy short format (e.g. "Treno 001") by adding 1000
    return String(1000 + num);
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
    const id = mapTrainToId(train);
    const durata = mapPeriodToDurata(period);

    if (!id) {
      // no train selected -> show default client-side chart
      setImgSrc(null);
      setError(null);
      setLoading(false);
      return;
    }

    const url = `http://127.0.0.1:5000/treno/${id}/velocita?durata=${durata}`;
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
        <h2 className="text-gray-900 mb-1">Velocità nel Tempo</h2>
        <p className="text-sm text-gray-500">Andamento della velocità — se è selezionato un treno verrà mostrato il grafico lato server.</p>
      </div>

      {imgSrc ? (
        <div className="flex justify-center p-4 bg-white border border-gray-200 rounded-lg">
          <img src={imgSrc} alt={`Velocità treno`} className="max-h-[420px] w-full object-contain" />
        </div>
      ) : (
        <>
          {loading && <div className="text-sm text-gray-500 mb-2">Caricamento grafico treno in corso…</div>}
          {error && <div className="text-sm text-red-600 mb-2">Impossibile caricare il grafico: {error}</div>}

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
                label={{ value: 'km/h', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280' } }}
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
                dataKey="speed" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
