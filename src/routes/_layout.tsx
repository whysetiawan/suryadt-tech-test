import 'react-native-reanimated';
import '../../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

const client = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={client}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="peripheral/[id]"
          options={{
            title: '',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
