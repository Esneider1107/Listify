// src/services/api.ts
const API_URL = "http://localhost:3000";

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error al llamar ${path}: ${err}`);
  }
  return res.json();
}

/* === INTERFACES === */
export interface TaskResponse {
  id: number;
  title: string;
  description?: string;
  category?: string;
  dueDate?: string;
  done: boolean;
  shared?: boolean;
  sharedWith?: string;
}

export interface PetResponse {
  id: number;
  name: string;
  level: number;
  experience: number;
  unlocked: boolean;
}

export interface HistoryResponse {
  id: number;
  taskId: number;
  title: string;
  completedAt: string;
  category?: string;
}

export interface UserProgressResponse {
  experience: number;
  level: number;
  petUnlocked?: boolean;
}

// ✅ Tipos para crear/actualizar tareas
export interface CreateTaskData {
  title: string;
  description?: string;
  category?: string;
  dueDate?: string;
  shared?: boolean;
  sharedWith?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  category?: string;
  dueDate?: string;
  done?: boolean;
  shared?: boolean;
  sharedWith?: string;
}

export interface AddToHistoryData {
  taskId: number;
  title: string;
  category?: string;
  completedAt: string;
}

/* === TASKS === */
export const getTasks = (): Promise<TaskResponse[]> => apiFetch("/tasks");
export const getTaskById = (id: number): Promise<TaskResponse> => apiFetch(`/tasks/${id}`);
export const createTask = (data: CreateTaskData): Promise<TaskResponse> =>
  apiFetch("/tasks", { method: "POST", body: JSON.stringify(data) });
export const updateTask = (id: number, data: UpdateTaskData): Promise<TaskResponse> =>
  apiFetch(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteTask = (id: number): Promise<void> =>
  apiFetch(`/tasks/${id}`, { method: "DELETE" });
export const markTaskAsDone = (id: number): Promise<TaskResponse> =>
  apiFetch(`/tasks/${id}/done`, { method: "PATCH" });
export const getTasksByCategory = (category: string): Promise<TaskResponse[]> =>
  apiFetch(`/tasks/category/${category}`);
export const getTasksByDate = (date: string): Promise<TaskResponse[]> =>
  apiFetch(`/tasks/date/${date}`);
export const getTasksInRange = (from: string, to: string): Promise<TaskResponse[]> =>
  apiFetch(`/tasks/range/${from}/${to}`);

/* === PET === */
export const getPet = (): Promise<PetResponse> => apiFetch("/pet");
export const unlockPet = (): Promise<PetResponse> =>
  apiFetch("/pet/unlock", { method: "POST" });
export const addExperience = (points: number): Promise<PetResponse> =>
  apiFetch("/pet/experience", {
    method: "POST",
    body: JSON.stringify({ points }),
  });
export const renamePet = (name: string): Promise<PetResponse> =>
  apiFetch("/pet/rename", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

/* === USER PROGRESS === */
export const getUserProgress = (): Promise<UserProgressResponse> => apiFetch("/user-progress");
export const addExperienceToUser = (points: number): Promise<UserProgressResponse> =>
  apiFetch("/user-progress/experience", {
    method: "POST",
    body: JSON.stringify({ points }),
  });

/* === HISTORY === */
export const getHistory = (): Promise<HistoryResponse[]> => apiFetch("/history");
export const getCompletedHistory = (): Promise<HistoryResponse[]> => apiFetch("/history/completed");
export const getPendingHistory = (): Promise<HistoryResponse[]> => apiFetch("/history/pending");
export const addToHistory = (data: AddToHistoryData): Promise<HistoryResponse> =>
  apiFetch("/history", { method: "POST", body: JSON.stringify(data) });

/* === SOCIAL === */
export const getSharedTasks = (): Promise<TaskResponse[]> => apiFetch("/social");
export const getSharedWith = (id: number): Promise<string[]> =>
  apiFetch(`/social/${id}/shared-with`);
export const shareTask = (id: number, sharedWith: string): Promise<TaskResponse> =>
  apiFetch(`/social/${id}/share`, {
    method: "PATCH",
    body: JSON.stringify({ sharedWith }),
  });

/* === OBJETOS AGRUPADOS === */
export const tasksApi = {
  getAll: getTasks,
  getOne: getTaskById,
  create: createTask,
  update: updateTask,
  delete: deleteTask,
  markAsDone: markTaskAsDone,
  getByCategory: getTasksByCategory,
  getByDate: getTasksByDate,
  getByRange: getTasksInRange,
};

export const petApi = {
  get: getPet,
  unlock: unlockPet,
  addExperience: addExperience,
  rename: renamePet,
};

export const historyApi = {
  getAll: getHistory,
  getCompleted: getCompletedHistory,
  getPending: getPendingHistory,
  add: addToHistory,
};

export const socialApi = {
  getSharedTasks: getSharedTasks,
  getSharedWith: getSharedWith,
  shareTask: shareTask,
};