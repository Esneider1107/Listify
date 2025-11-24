'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Home, CheckSquare, Clock, Settings, HelpCircle, ChevronLeft, ChevronRight, User, Trophy, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getTasksByDate, getPet } from '@/services/api';

// ✅ Definir interfaces para los tipos
interface Task {
  id: string;
  title: string;
  category?: string;
  done: boolean;
}

interface Pet {
  unlocked: boolean;
  name?: string;
  level: number;
  experience: number;
}

export default function ListifyDashboard() {
  const router = useRouter();
  const { tasks, gameData } = useApp();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);
  const [loadingDateTasks, setLoadingDateTasks] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loadingPet, setLoadingPet] = useState(true);

  const completedTasks = tasks.filter(t => t.done).length;
  const pendingTasks = tasks.filter(t => !t.done).length;

  // ✅ Usar useCallback para evitar el warning de dependencias
  const loadTasksForDate = useCallback(async (day: number) => {
    try {
      setLoadingDateTasks(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const localDate = new Date(year, month, day);
      
      const dateStr = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      
      const dateTasks = await getTasksByDate(dateStr);
      // Mapear TaskResponse[] a Task[]
      const mappedTasks: Task[] = dateTasks.map((task) => ({
        id: task.id.toString(),
        title: task.title,
        category: task.category,
        done: task.done,
        description: task.description,
        dueDate: task.dueDate,
        shared: task.shared,
        sharedWith: task.sharedWith,
      }));
      setTasksForSelectedDate(mappedTasks);
    } catch (error) {
      console.error('Error loading tasks for date:', error);
      setTasksForSelectedDate([]);
    } finally {
      setLoadingDateTasks(false);
    }
  }, [currentDate]);

  useEffect(() => {
    loadTasksForDate(selectedDate);
  }, [selectedDate, loadTasksForDate]);

  useEffect(() => {
    const loadPetData = async () => {
      try {
        setLoadingPet(true);
        const petData = await getPet();
        setPet(petData);
      } catch (error) {
        console.error('Error loading pet:', error);
      } finally {
        setLoadingPet(false);
      }
    };
    
    loadPetData();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  const days = getDaysInMonth(currentDate);
  const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

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
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#ef4444', backgroundColor: '#fef2f2', border: 'none', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <Home size={20} />
            <span style={{ fontWeight: '500' }}>Home</span>
          </button>
          
          <button 
            onClick={() => router.push('/tasks')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#374151', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <CheckSquare size={20} />
            <span>Task</span>
            {pendingTasks > 0 && (
              <span style={{
                marginLeft: 'auto',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {pendingTasks}
              </span>
            )}
          </button>

          <button 
            onClick={() => router.push('/history')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#374151', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <Clock size={20} />
            <span>Historial</span>
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
              Home
            </h2>
            <button style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Stats and Calendar Panel */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '32px' }}>
              {/* Stats Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Trophy size={32} color="#eab308" />
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                      {gameData.xp}/{gameData.xpToNextLevel} XP
                    </div>
                    <div style={{ width: '256px', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginTop: '8px' }}>
                      <div style={{ 
                        width: `${(gameData.xp / gameData.xpToNextLevel) * 100}%`, 
                        height: '8px', 
                        backgroundColor: 'black', 
                        borderRadius: '4px' 
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {completedTasks}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TAREAS</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>COMPLETADAS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Flame color="#f97316" size={32} />
                    <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{gameData.streak}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DÍAS DE RACHA</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {gameData.level}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NIVEL ACTUAL</div>
                </div>
              </div>

              {/* Calendar */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{monthYear}</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => changeMonth(-1)}
                      style={{ padding: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                    >
                      <ChevronLeft size={20} color="#6b7280" />
                    </button>
                    <button 
                      onClick={() => changeMonth(1)}
                      style={{ padding: '6px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                    >
                      <ChevronRight size={20} color="#6b7280" />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginBottom: '12px', fontWeight: '500' }}>
                  <div>DOM</div>
                  <div>LUN</div>
                  <div>MAR</div>
                  <div>MIÉ</div>
                  <div>JUE</div>
                  <div>VIE</div>
                  <div>SÁB</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                  {days.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      style={{
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        fontSize: '14px',
                        border: 'none',
                        cursor: day ? 'pointer' : 'default',
                        visibility: day ? 'visible' : 'hidden',
                        backgroundColor: day === selectedDate ? '#3b82f6' : 'transparent',
                        color: day === selectedDate ? 'white' : day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() ? '#3b82f6' : '#1f2937',
                        fontWeight: day === selectedDate || (day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()) ? '600' : '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (day && day !== selectedDate) {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (day && day !== selectedDate) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Time</span>
                <span style={{ fontSize: '14px', fontWeight: '600', backgroundColor: '#f3f4f6', padding: '6px 16px', borderRadius: '8px' }}>
                  {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Right Column - Mascot and Tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Mascot Card */}
              <div 
                onClick={() => router.push('/pet')}
                style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                {loadingPet ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ width: '32px', height: '32px', border: '3px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
                  </div>
                ) : pet && pet.unlocked ? (
                  <>
                    <div style={{ width: '140px', height: '140px', backgroundColor: '#fed7aa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <div style={{ fontSize: '72px' }}>🐱</div>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '18px', marginBottom: '4px' }}>
                        {pet.name || 'LISTI'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Nivel {pet.level}
                      </div>
                    </div>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: '#6b7280' }}>
                        <span>XP</span>
                        <span>{pet.experience}/100</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                        <div style={{ 
                          width: `${(pet.experience / 100) * 100}%`, 
                          height: '6px', 
                          backgroundColor: '#f97316', 
                          borderRadius: '3px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>🔒</div>
                    <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                      Completa tareas para desbloquear tu mascota
                    </p>
                  </div>
                )}
              </div>

              {/* Tasks for selected date */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '24px', flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                  Tareas del día {selectedDate}
                </h3>
                {loadingDateTasks ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                    Cargando...
                  </div>
                ) : tasksForSelectedDate.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#d1d5db', padding: '20px' }}>
                    No hay tareas para este día
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tasksForSelectedDate.map(task => (
                      <div key={task.id} style={{
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        borderLeft: `3px solid ${task.done ? '#10b981' : '#3b82f6'}`
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                          {task.title}
                        </div>
                        {task.category && (
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {task.category}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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