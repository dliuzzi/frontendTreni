import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Lun', mass: 420 },
  { day: 'Mar', mass: 485 },
  { day: 'Mer', mass: 510 },
  { day: 'Gio', mass: 465 },
  { day: 'Ven', mass: 530 },
  { day: 'Sab', mass: 580 },
  { day: 'Dom', mass: 395 }
];

interface MassChartProps {
  train?: string;
  period?: string;
}

export function MassChart({ train, period }: MassChartProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapTrainToId(trainLabel?: string) {
    if (!trainLabel) return null;
    const match = trainLabel.match(/(\d+)/);
    const num = match ? parseInt(match[0], 10) : NaN;
    if (Number.isNaN(num)) return null;
    if (num >= 1000) return String(num);
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
      setImgSrc(null);
      setError(null);
      setLoading(false);
      return;
    }

    const url = `http://127.0.0.1:5000/treno/${id}/carico?durata=${durata}`;
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
        <h2 className="text-gray-900 mb-1">Carico</h2>
        <p className="text-sm text-gray-500">Carico del treno — se è selezionato un treno verrà mostrato il grafico lato server.</p>
      </div>

      {imgSrc ? (
        <div className="flex justify-center p-4 bg-white border border-gray-200 rounded-lg">
          <img src={imgSrc} alt={`Carico treno`} className="max-h-[420px] w-full object-contain" />
        </div>
      ) : (
        <>
          {loading && <div className="text-sm text-gray-500 mb-2">Caricamento grafico carico in corso…</div>}
          {error && <div className="text-sm text-red-600 mb-2">Impossibile caricare il grafico carico: {error}</div>}

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Tonnellate', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280' } }}
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
          <Bar 
            dataKey="mass" 
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
          </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
