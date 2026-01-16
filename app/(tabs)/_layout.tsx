import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "To Do List",
            headerTitleAlign: true,
          }}
        />
        <Stack.Screen
          name="Ayarlar"
          options={{
            title: "Ayarlar",
            headerTitleAlign: 'Geri',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  )
}