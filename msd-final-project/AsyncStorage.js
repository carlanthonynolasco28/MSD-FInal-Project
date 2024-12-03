import AsyncStorage from "@react-native-async-storage/async-storage";


export const getTasks = async () => {
  const tasks = await AsyncStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
};


export const addTask = async (task) => {
  const tasks = await getTasks();
  const newTasks = [...tasks, { ...task, id: Date.now().toString() }];
  await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  return newTasks;
};


export const updateTask = async (updatedTask) => {
  const tasks = await getTasks();
  const newTasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  return newTasks;
};


export const deleteTask = async (id) => {
  const tasks = await getTasks();
  const newTasks = tasks.filter((task) => task.id !== id);
  await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  return newTasks;
};
