'use client';

import { useState, useEffect } from 'react';
import { socialApi, TaskResponse } from '@/services/api';
import { Users, Share2, Calendar, Tag, Loader, AlertCircle } from 'lucide-react';

export default function SocialPage() {
  const [sharedTasks, setSharedTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSharedTasks();
  }, []);

  const loadSharedTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await socialApi.getSharedTasks();
      setSharedTasks(tasks);
    } catch (err) {
      console.error('Error loading shared tasks:', err);
      setError('Error al cargar las tareas compartidas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <Loader size={48} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '18px', color: '#6b7280' }}>Cargando tareas compartidas...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px'
      }}>
        <AlertCircle size={48} color="#ef4444" />
        <p style={{ fontSize: '18px', color: '#ef4444' }}>{error}</p>
        <button
          onClick={loadSharedTasks}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Share2 size={32} color="#3b82f6" />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            Tareas Compartidas
          </h1>
        </div>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Gestiona y visualiza las tareas que has compartido con otros
        </p>
      </div>

      {/* Stats Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#dbeafe',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Share2 size={28} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
              {sharedTasks.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Tareas Compartidas
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#fef3c7',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={28} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
              {new Set(sharedTasks.map(t => t.sharedWith).filter(Boolean)).size}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Personas
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#dcfce7',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={28} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
              {sharedTasks.filter(t => t.dueDate).length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Con Fecha Límite
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {sharedTasks.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '64px 32px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Share2 size={64} color="#d1d5db" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            No hay tareas compartidas
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
            Las tareas que compartas aparecerán aquí
          </p>
          <a href="/tasks" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Ir a Tareas
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sharedTasks.map(task => (
            <div
              key={task.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #3b82f6',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {task.title}
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: task.done ? '#dcfce7' : '#dbeafe',
                      color: task.done ? '#10b981' : '#3b82f6',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      {task.done ? '✓ Completada' : 'Pendiente'}
                    </span>
                  </h3>

                  {task.description && (
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '12px',
                      lineHeight: '1.5'
                    }}>
                      {task.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    {task.category && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        padding: '4px 12px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        color: '#374151',
                        fontWeight: '500'
                      }}>
                        <Tag size={14} />
                        {task.category}
                      </span>
                    )}

                    {task.dueDate && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        padding: '4px 12px',
                        backgroundColor: '#fef3c7',
                        borderRadius: '6px',
                        color: '#92400e',
                        fontWeight: '500'
                      }}>
                        <Calendar size={14} />
                        {new Date(task.dueDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    )}

                    {task.sharedWith && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        padding: '4px 12px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '6px',
                        color: '#1e40af',
                        fontWeight: '500'
                      }}>
                        <Users size={14} />
                        Compartida con: {task.sharedWith}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}