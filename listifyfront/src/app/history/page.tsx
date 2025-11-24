
"use client";

import { useEffect, useState } from "react";
import { historyApi } from "@/services/api";
import { Home, CheckSquare, Clock, Settings, HelpCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HistoryItem {
  id: number;
  title: string;
  description?: string;
  category?: string;
  done: boolean;
  createdAt: string;
}

type FilterType =  "all" | "completed" | "deleted"; 

export default function HistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

const loadHistory = async (filterType: FilterType) => {
  setLoading(true);
  setError(null);

  try {
    let data: HistoryItem[] = [];

    switch (filterType) {
      case "completed":
        data = (await historyApi.getCompleted()).map((item) => ({
          ...item,
          done: true, // tu API NO lo trae, así que lo creamos
          createdAt: new Date().toISOString(),
        }));
        break;

      case "deleted":
        data = (await historyApi.getPending()).map((item) => ({
          ...item,
          done: false, // idem
          createdAt: new Date().toISOString(),
        }));
        break;
      case "all":
        data = [
          ...(await historyApi.getCompleted()).map((item) => ({
            ...item,
            done: true, // tu API NO lo trae, así que lo creamos
            createdAt: new Date().toISOString(),
          })),
          ...(await historyApi.getPending()).map((item) => ({
            ...item,
            done: false, // idem
            createdAt: new Date().toISOString(),
          })),
        ];
        break;
    }

    setHistoryItems(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error al cargar el historial");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadHistory(filter);
  }, [filter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "short" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${day} ${month} ${year} • ${time}`;
  };

  const FilterTab = ({ type, label }: { type: FilterType; label: string }) => (
    <button
      onClick={() => setFilter(type)}
      style={{
        padding: '10px 24px',
        fontSize: '14px',
        fontWeight: '500',
        border: 'none',
        backgroundColor: 'transparent',
        color: filter === type ? '#ef4444' : '#6b7280',
        cursor: 'pointer',
        transition: 'color 0.2s',
        borderRadius: '8px'
      }}
      onMouseEnter={(e) => {
        if (filter !== type) e.currentTarget.style.color = '#374151';
      }}
      onMouseLeave={(e) => {
        if (filter !== type) e.currentTarget.style.color = '#6b7280';
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '256px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare color="#f97316" size={32} />
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c', margin: 0 }}>Listify</h1>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 16px' }}>
          <button 
            onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#374151', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <Home size={20} />
            <span>Home</span>
          </button>
          
          <button 
            onClick={() => router.push('/tasks')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#374151', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <CheckSquare size={20} />
            <span>Task</span>
          </button>

          <button 
            onClick={() => router.push('/history')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#ef4444', backgroundColor: '#fef2f2', border: 'none', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <Clock size={20} />
            <span style={{ fontWeight: '500' }}>Historial</span>
          </button>

          <button 
            onClick={() => router.push('/pet')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#374151', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <span style={{ fontSize: '20px' }}>🐱</span>
            <span>Mascota</span>
          </button>

          <button 
            onClick={() => router.push('/settings')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#374151', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <Settings size={20} />
            <span>Configuración</span>
          </button>

          <button 
            onClick={() => router.push('/help')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#374151', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <HelpCircle size={20} />
            <span>Centro de ayuda</span>
          </button>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#374151', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '500' }}>
              N
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Historial
            </h2>
            <button style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '32px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                Historial 📋
              </h1>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Gestiona tu historial de tareas</p>
            </div>

            {/* Filtros */}
            <div style={{ display: 'flex', gap: '1px', backgroundColor: 'white', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <FilterTab type="all" label="Todas" />
              <FilterTab type="completed" label="Completadas" />
              <FilterTab type="deleted" label="Eliminadas" />
            </div>

            {/* Contenido */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                <p style={{ marginTop: '16px', color: '#9ca3af' }}>Cargando...</p>
              </div>
            ) : error ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
                <button
                  onClick={() => loadHistory(filter)}
                  style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                >
                  Reintentar
                </button>
              </div>
            ) : historyItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ color: '#d1d5db', fontSize: '16px' }}>
                  {filter === "completed"
                    ? "No hay tareas completadas"
                    : filter === "deleted"
                    ? "No hay tareas eliminadas"
                    : "No hay tareas en el historial"}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      borderLeft: item.done ? 'none' : '4px solid #3b82f6',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                      {/* Contenido */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0, lineHeight: '1.4' }}>
                            {item.title}
                          </h3>
                          <span style={{ 
                            fontSize: '10px', 
                            color: item.done ? '#16a34a' : '#ef4444', 
                            backgroundColor: item.done ? '#dcfce7' : '#fee2e2',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px', 
                            fontWeight: '600', 
                            whiteSpace: 'nowrap', 
                            marginLeft: '12px' 
                          }}>
                            {item.done ? 'COMPLETADO' : 'ELIMINADO'}
                          </span>
                        </div>

                        {item.description && (
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                            {item.description}
                          </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                          {item.category && (
                            <span style={{ padding: '4px 10px', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '6px', fontWeight: '500' }}>
                              {item.category}
                            </span>
                          )}
                          <span style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Estadísticas */}
            {!loading && !error && historyItems.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '32px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '4px' }}>
                    {historyItems.length}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b21a8', fontWeight: '500', margin: 0 }}>Total</p>
                </div>
                
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>
                    {historyItems.filter((item) => item.done).length}
                  </p>
                  <p style={{ fontSize: '12px', color: '#166534', fontWeight: '500', margin: 0 }}>Completadas</p>
                </div>
                
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>
                    {historyItems.filter((item) => !item.done).length}
                  </p>
                  <p style={{ fontSize: '12px', color: '#991b1b', fontWeight: '500', margin: 0 }}>Eliminadas</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
