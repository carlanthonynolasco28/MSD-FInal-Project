import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import EditTaskScreen from "./screens/EditTaskScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Task Manager" }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: "Add Task" }} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: "Edit Task" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
