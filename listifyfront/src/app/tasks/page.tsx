'use client';

import { useState } from 'react';
import { useApp, Task } from '@/context/AppContext';
import { Plus, Trash2, X, Share2, Users, Edit2, Clock, Save, Home, CheckSquare, Settings, HelpCircle, User, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const router = useRouter();
  const { tasks, addTask, deleteTask, completeTask, updateTask, loading } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [sharedWith, setSharedWith] = useState('');
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const uniqueCategories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === 'all' ? true : !task.done;
    const categoryMatch = categoryFilter === 'all' ? true : task.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        let taskDueDate = undefined;
        if (dueDate) {
          taskDueDate = new Date(dueDate);
          if (dueTime) {
            const [hours, minutes] = dueTime.split(':');
            taskDueDate.setHours(parseInt(hours), parseInt(minutes));
          }
        }

        await addTask({
          title: newTaskTitle,
          description: newTaskDescription || undefined,
          category: newTaskCategory || undefined,
          dueDate: taskDueDate ? taskDueDate.toISOString() : undefined,
          shared: isShared,
          sharedWith: isShared ? sharedWith : undefined,
        });
        
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskCategory('');
        setDueDate('');
        setDueTime('');
        setIsShared(false);
        setSharedWith('');
        setShowAddTask(false);
      } catch (error) {
        console.error('Error al crear tarea:', error);
        alert('Error al crear la tarea. Verifica que el backend esté corriendo.');
      }
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCategory(task.category || '');
    
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      setEditDate(date.toISOString().split('T')[0]);
      setEditTime(date.toTimeString().slice(0, 5));
    } else {
      setEditDate('');
      setEditTime('');
    }
  };

  const handleSaveEdit = async (taskId: number) => {
    try {
      let taskDueDate = undefined;
      if (editDate) {
        taskDueDate = new Date(editDate);
        if (editTime) {
          const [hours, minutes] = editTime.split(':');
          taskDueDate.setHours(parseInt(hours), parseInt(minutes));
        }
      }

      await updateTask(taskId.toString(), {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        dueDate: taskDueDate ? taskDueDate.toISOString() : undefined
      });

      setEditingTask(null);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al actualizar la tarea');
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
    setEditCategory('');
    setEditDate('');
    setEditTime('');
  };

  const handleComplete = async (id: number) => {
    try {
      await completeTask(id.toString());
    } catch (error) {
      console.error('Error al completar tarea:', error);
      alert('Error al completar la tarea.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(id.toString());
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Error al eliminar la tarea.');
      }
    }
  };

  const formatDateTime = (date: Date) => {
    const dateStr = new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${dateStr} • ${timeStr}`;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Cargando...
      </div>
    );
  }

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
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: '#ef4444', backgroundColor: '#fef2f2', border: 'none', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <CheckSquare size={20} />
            <span style={{ fontWeight: '500' }}>Task</span>
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
            <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
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
        {/* Header con búsqueda */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Tareas
            </h2>
            <button style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              Mis Tareas 📋
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280' }}>
              Gestiona tus tareas y gana experiencia
            </p>
          </div>

          {/* Filters */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['all', 'pending'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: filter === f ? '#fef2f2' : '#f9fafb',
                      color: filter === f ? '#ef4444' : '#6b7280',
                      fontWeight: filter === f ? '600' : '500',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {f === 'all' ? 'Todas' : 'Pendientes'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setCategoryFilter('all')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: categoryFilter === 'all' ? '#fef2f2' : '#f9fafb',
                    color: categoryFilter === 'all' ? '#ef4444' : '#6b7280',
                    fontWeight: categoryFilter === 'all' ? '600' : '500',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Todas
                </button>
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat || 'all')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: categoryFilter === cat ? '#fef2f2' : '#f9fafb',
                      color: categoryFilter === cat ? '#ef4444' : '#6b7280',
                      fontWeight: categoryFilter === cat ? '600' : '500',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add Task Button */}
          {!showAddTask && (
            <button
              onClick={() => setShowAddTask(true)}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#fef2f2',
                border: '2px dashed #ef4444',
                borderRadius: '12px',
                color: '#ef4444',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '24px',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={20} />
              Crear Nueva Tarea
            </button>
          )}

          {/* Add Task Form */}
          {showAddTask && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Nueva Tarea
                </h3>
                <button
                  onClick={() => {
                    setShowAddTask(false);
                    setNewTaskTitle('');
                    setNewTaskDescription('');
                    setNewTaskCategory('');
                    setDueDate('');
                    setDueTime('');
                    setIsShared(false);
                    setSharedWith('');
                  }}
                  style={{
                    padding: '4px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Título de la tarea *"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  marginBottom: '12px',
                  outline: 'none'
                }}
              />

              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Descripción (opcional)"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '12px',
                  outline: 'none',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />

              <input
                type="text"
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                placeholder="Categoría (ej: Trabajo, Casa, Estudio, Compras)"
                list="categories"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '12px',
                  outline: 'none'
                }}
              />
              <datalist id="categories">
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
                <option value="Trabajo" />
                <option value="Casa" />
                <option value="Estudio" />
                <option value="Compras" />
              </datalist>

              {/* Fecha y Hora */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    📅 Fecha de vencimiento
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    🕐 Hora
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    disabled={!dueDate}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: !dueDate ? '#f3f4f6' : 'white',
                      cursor: !dueDate ? 'not-allowed' : 'text'
                    }}
                  />
                </div>
              </div>

              {/* Compartir */}
              <div style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '16px' 
              }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  marginBottom: isShared ? '12px' : 0
                }}>
                  <input
                    type="checkbox"
                    checked={isShared}
                    onChange={(e) => {
                      setIsShared(e.target.checked);
                      if (!e.target.checked) setSharedWith('');
                    }}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <Share2 size={18} color="#6b7280" />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Compartir esta tarea
                  </span>
                </label>

                {isShared && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>
                      <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Compartir con (email o nombre)
                    </label>
                    <input
                      type="text"
                      value={sharedWith}
                      onChange={(e) => setSharedWith(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: newTaskTitle.trim() ? '#ef4444' : '#d1d5db',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: newTaskTitle.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                Crear Tarea
              </button>
            </div>
          )}

          {/* Tasks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTasks.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                color: '#9ca3af'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                  No hay tareas aquí
                </div>
                <div style={{ fontSize: '14px' }}>
                  ¡Crea tu primera tarea para comenzar!
                </div>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '16px',
                    transition: 'all 0.2s ease',
                    borderLeft: task.shared ? '4px solid #3b82f6' : 'none'
                  }}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleComplete(task.id)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: '2px solid #d1d5db',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                  </button>

                  {/* Task Info */}
                  <div style={{ flex: 1 }}>
                    {editingTask === task.id ? (
                      // MODO EDICIÓN
                      <div>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #3b82f6',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            outline: 'none'
                          }}
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Descripción"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            marginBottom: '8px',
                            outline: 'none',
                            minHeight: '60px',
                            resize: 'vertical'
                          }}
                        />
                        <input
                          type="text"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          placeholder="Categoría"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            marginBottom: '8px',
                            outline: 'none'
                          }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            style={{
                              padding: '8px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '6px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                          <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            disabled={!editDate}
                            style={{
                              padding: '8px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '6px',
                              fontSize: '14px',
                              outline: 'none',
                              backgroundColor: !editDate ? '#f3f4f6' : 'white'
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Save size={16} />
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      // MODO VISTA
                      <>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '8px', marginBottom: '8px' }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#1f2937',
                            flex: 1
                          }}>
                            {task.title}
                            {task.shared && (
                              <Share2 size={14} color="#3b82f6" style={{ display: 'inline', marginLeft: '8px' }} />
                            )}
                          </div>
                        </div>
                        
                        {task.description && (
                          <div style={{ 
                            fontSize: '14px', 
                            color: '#6b7280', 
                            marginBottom: '8px' 
                          }}>
                            {task.description}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {task.category && (
                            <span style={{
                              fontSize: '12px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              fontWeight: '500'
                            }}>
                              {task.category}
                            </span>
                          )}

                          {task.dueDate && (
                            <span style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Clock size={12} />
                              {formatDateTime(new Date(task.dueDate))}
                            </span>
                          )}

                          {task.shared && task.sharedWith && (
                            <span style={{
                              fontSize: '12px',
                              color: '#3b82f6',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Users size={12} />
                              {task.sharedWith}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {editingTask !== task.id && (
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleStartEdit(task)}
                        style={{
                          padding: '8px',
                          border: 'none',
                          backgroundColor: '#dbeafe',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#3b82f6',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        style={{
                          padding: '8px',
                          border: 'none',
                          backgroundColor: '#fef2f2',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#ef4444',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Stats Footer */}
          {filteredTasks.length > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Total: {filteredTasks.length} tarea{filteredTasks.length !== 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Pendientes: {filteredTasks.filter(t => !t.done).length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}