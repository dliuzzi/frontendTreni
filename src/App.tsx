import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { FilterSection } from "./components/FilterSection";
import { KPICard } from "./components/KPICard";
import { SpeedChart } from "./components/SpeedChart";
import { EnergyChart } from "./components/EnergyChart";
import { MassChart } from "./components/MassChart";
import { ExportSection } from "./components/ExportSection";
import { Gauge, Zap, Weight, AlertTriangle } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [filters, setFilters] = useState({
    // train will hold the numeric treno_id as string (e.g. "1001")
    train: "",
    period: "Ultima settimana",
    line: "Alta velocità",
  });

  const [medieData, setMedieData] = useState<{
    anomalie?: number;
    medie?: {
      massimo_massa?: string;
      media_velocita?: string;
      totale_consumo?: string;
    };
  } | null>(null);

  const [medieError, setMedieError] = useState<string | null>(null);

  useEffect(() => {
    const abort = new AbortController();

    async function fetchMedie() {
      try {
        setMedieError(null);
        const res = await fetch("http://127.0.0.1:5000/medie", {
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        setMedieData(data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setMedieError(err?.message ?? String(err));
      }
    }

    fetchMedie();

    // cleanup when component unmounts
    return () => abort.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">
              {activeSection === "home" ? "Dashboard" : activeSection}
            </span>
          </div>

          {/* Filter Section */}
          <FilterSection filters={filters} setFilters={setFilters} />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              icon={<Gauge className="w-6 h-6" />}
              title="Velocità Media"
              value={
                medieData?.medie?.media_velocita
                  ? `${parseFloat(medieData.medie.media_velocita).toFixed(
                      2
                    )} km/h`
                  : "—"
              }
              trend={5.2}
              color="blue"
            />
            <KPICard
              icon={<Zap className="w-6 h-6" />}
              title="Consumo Totale"
              value={
                medieData?.medie?.totale_consumo
                  ? `${Number(
                      medieData.medie.totale_consumo
                    ).toLocaleString()} kWh`
                  : "—"
              }
              trend={-2.1}
              color="green"
            />
            <KPICard
              icon={<Weight className="w-6 h-6" />}
              title="Carico Massimo"
              value={
                medieData?.medie?.massimo_massa
                  ? `${Number(
                      medieData.medie.massimo_massa
                    ).toLocaleString()} kg`
                  : "—"
              }
              trend={3.8}
              color="purple"
            />
            <KPICard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Anomalie Rilevate"
              value={
                typeof medieData?.anomalie === "number"
                  ? String(medieData.anomalie)
                  : "—"
              }
              trend={-15.4}
              color="red"
            />
          </div>

          {/* Charts Section */}
          <section
            id="velocita"
            data-section="Velocità"
            aria-labelledby="velocita-heading"
            className="mb-8"
          >
            <h2 id="velocita-heading" className="sr-only">
              Velocità
            </h2>
            <div className="space-y-6">
              <SpeedChart train={filters.train} period={filters.period} />
            </div>
          </section>

          <section
            id="consumo"
            data-section="Consumo"
            aria-labelledby="consumo-heading"
            className="mb-8"
          >
            <h2 id="consumo-heading" className="sr-only">
              Consumo Energetico
            </h2>
            <div className="space-y-6">
              <EnergyChart train={filters.train} period={filters.period} />
            </div>
          </section>

          <section
            id="massa"
            data-section="Massa"
            aria-labelledby="massa-heading"
            className="mb-8"
          >
            <h2 id="massa-heading" className="sr-only">
              Sollevamento Carico
            </h2>
            <div className="space-y-6">
              <MassChart train={filters.train} period={filters.period} />
            </div>
          </section>

          {/* Export Section */}
          <section
            id="report"
            data-section="Report"
            aria-labelledby="report-heading"
            className="mb-8"
          >
            <h2 id="report-heading" className="sr-only">
              Report / Esportazione
            </h2>
            <ExportSection train={filters.train} period={filters.period} />
          </section>
        </main>
      </div>
    </div>
  );
}
