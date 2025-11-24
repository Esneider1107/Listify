"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as api from '@/services/api';

// ---------------- TIPOS ----------------

export interface Task {
  id: number;
  title: string;
  description?: string;
  category?: string;
  dueDate?: string;
  done: boolean;
  shared?: boolean;
  sharedWith?: string;
}

export interface Pet {
  id: number;
  name: string;
  level: number;
  experience: number;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface GameData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  petUnlocked: boolean;
  totalExperience: number;
  achievements: Achievement[];
}

// ❗ Datos permitidos para crear tarea
export type CreateTaskDTO = Omit<Task, "id" | "done">;

// ❗ Datos permitidos para actualizar tarea
export type UpdateTaskDTO = Partial<Task>;

// ---------------- CONTEXTO ----------------

interface AppContextType {
  tasks: Task[];
  gameData: GameData;
  pet: Pet | null;
  loading: boolean;

  addTask: (task: CreateTaskDTO) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskDTO) => Promise<void>;

  refreshTasks: () => Promise<void>;
  refreshGameData: () => Promise<void>;
  refreshPet: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ---------------- PROVIDER ----------------

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pet, setPet] = useState<Pet | null>(null);
  const [gameData, setGameData] = useState<GameData>({
    level: 1,
    xp: 0,
    xpToNextLevel: 500,
    streak: 0,
    petUnlocked: false,
    totalExperience: 0,
    achievements: [],
  });
  const [loading, setLoading] = useState(true);

  // ---------------- REFRESH TASKS ----------------
  const refreshTasks = useCallback(async () => {
    try {
      const fetchedTasks = await api.getTasks();
      // Mapear TaskResponse[] a Task[]
      const mappedTasks: Task[] = fetchedTasks.map((task: api.TaskResponse) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        dueDate: task.dueDate,
        done: task.done,
        shared: task.shared,
        sharedWith: task.sharedWith,
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }, []);

  // ---------------- REFRESH GAME DATA ----------------
  const refreshGameData = useCallback(async () => {
  try {
    const userProgress = await api.getUserProgress();

    const totalXP = Number(userProgress.experience ?? 0);
    const level = Math.floor(totalXP / 500) + 1;
    const xpInCurrentLevel = totalXP % 500;
      const achievements: Achievement[] = [
        { id: "1", name: "Primera Tarea", description: "Completa tu primera tarea", unlocked: totalXP >= 10 },
        { id: "2", name: "Mascota Desbloqueada", description: "Desbloquea tu primera mascota", unlocked: userProgress.petUnlocked || false },
        { id: "3", name: "Coleccionista", description: "Completa 10 tareas", unlocked: totalXP >= 100 },
        { id: "4", name: "Nivel 5", description: "Alcanza el nivel 5", unlocked: level >= 5 },
        { id: "5", name: "Maestro de Tareas", description: "Completa 50 tareas", unlocked: totalXP >= 500 },
        { id: "6", name: "Nivel 10", description: "Alcanza el nivel 10", unlocked: level >= 10 },
      ];

        setGameData({
          level,
          xp: xpInCurrentLevel,
          xpToNextLevel: 500,
          streak: 1,
          petUnlocked: userProgress.petUnlocked || false,
          totalExperience: totalXP,
          achievements,
      });
    } catch (error) {
      console.error("Error loading game data:", error);
    }
  }, []);

  // ---------------- REFRESH PET ----------------
  const refreshPet = useCallback(async () => {
    try {
      const petData = await api.getPet();
      // Mapear PetResponse a Pet
      const mappedPet: Pet = {
        id: petData.id,
        name: petData.name,
        level: petData.level,
        experience: petData.experience,
        unlocked: petData.unlocked,
      };
      setPet(mappedPet);
    } catch (error) {
      console.error("Error loading pet:", error);
    }
  }, []);

  // ---------------- REFRESH ALL ----------------
  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([refreshTasks(), refreshGameData(), refreshPet()]);
    setLoading(false);
  }, [refreshTasks, refreshGameData, refreshPet]);

  // ---------------- CRUD TASKS ----------------

  const addTask = async (taskData: CreateTaskDTO) => {
    try {
      await api.createTask(taskData);
      await refreshTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.deleteTask(Number(id));
      await refreshTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  const completeTask = async (id: string) => {
    try {
      await api.markTaskAsDone(Number(id));

      await Promise.all([refreshTasks(), refreshGameData(), refreshPet()]);

      console.log("✅ Tarea completada, XP añadido correctamente");
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: UpdateTaskDTO) => {
    try {
      await api.updateTask(Number(id), updates);
      await refreshTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  // -----------------------------------------------

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        gameData,
        pet,
        loading,
        addTask,
        deleteTask,
        completeTask,
        updateTask,
        refreshTasks,
        refreshGameData,
        refreshPet,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};