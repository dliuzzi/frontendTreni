import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

const comparisonData = [
  { time: '00:00', periodA: 120, periodB: 105 },
  { time: '04:00', periodA: 145, periodB: 138 },
  { time: '08:00', periodA: 168, periodB: 152 },
  { time: '12:00', periodA: 175, periodB: 165 },
  { time: '16:00', periodA: 162, periodB: 148 },
  { time: '20:00', periodA: 135, periodB: 128 },
  { time: '24:00', periodA: 95, periodB: 88 }
];

export function ComparisonSection() {
  const [periodA, setPeriodA] = useState('Ultima settimana');
  const [periodB, setPeriodB] = useState('Due settimane fa');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Confronto Periodi</h2>
        <p className="text-sm text-gray-500">Analisi comparativa tra due periodi temporali</p>
      </div>

      {/* Period Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Periodo A</label>
          <div className="relative">
            <select
              value={periodA}
              onChange={(e) => setPeriodA(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Ultima settimana</option>
              <option>Ultimo mese</option>
              <option>Ultimi 3 mesi</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Periodo B</label>
          <div className="relative">
            <select
              value={periodB}
              onChange={(e) => setPeriodB(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Due settimane fa</option>
              <option>Due mesi fa</option>
              <option>6 mesi fa</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Comparison Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Velocità Media</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl text-gray-900">+8.5%</div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-xs text-gray-500 mt-1">Periodo A vs Periodo B</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Consumo Energetico</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl text-gray-900">-3.2%</div>
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-xs text-gray-500 mt-1">Periodo A vs Periodo B</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Carico Medio</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl text-gray-900">+12.1%</div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-xs text-gray-500 mt-1">Periodo A vs Periodo B</div>
        </div>
      </div>

      {/* Comparison Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={comparisonData}>
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
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="periodA" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name={periodA}
            dot={{ fill: '#3b82f6', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="periodB" 
            stroke="#f97316" 
            strokeWidth={2}
            name={periodB}
            dot={{ fill: '#f97316', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
