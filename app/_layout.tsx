import { Stack } from "expo-router";
import AppProvider from "./context/useContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="authentication" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="Styles" />
        <Stack.Screen name="components" />
      </Stack>
    </AppProvider>
  );
}
