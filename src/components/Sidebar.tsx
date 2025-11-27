import React, { useCallback } from "react";
import { Gauge, Zap, Weight, FileText } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { id: "Velocità", label: "Velocità", icon: Gauge },
    { id: "Consumo", label: "Consumo Energetico", icon: Zap },
    { id: "Massa", label: "Sollevamento Carico", icon: Weight },
    { id: "Report", label: "Report / Esportazione", icon: FileText },
  ];

  // Rimuove diacritici + spazi -> stringa "slug" (es: "Velocità" -> "velocita")
  const slugify = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .toLowerCase();

  const findSectionElement = (id: string): HTMLElement | null => {
    // Prova più possibili identificatori: id diretto, id minuscolo, slug, slug senza case etc.
    const candidates = [
      id,
      id.toLowerCase(),
      slugify(id),
      slugify(id).toLowerCase(),
    ];
    for (const c of candidates) {
      const el = document.getElementById(c);
      if (el) return el;
    }
    // fallback: cerca un attributo data-section con il valore originale
    const dataSec = document.querySelector(`[data-section="${id}"]`);
    if (dataSec && dataSec instanceof HTMLElement) return dataSec;
    return null;
  };

  const handleClick = useCallback(
    (id: string) => {
      // imposta stato attivo
      setActiveSection(id);

      // tenta di trovare l'elemento corrispondente nella pagina
      const el = findSectionElement(id);
      if (!el) return;

      // Considera l'header fisso (top-16 = 4rem = 64px) per non nascondere la sezione
      const headerOffset = 64;
      const elementPosition =
        el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      // scroll smooth
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    },
    [setActiveSection]
  );

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gray-900 text-white overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
