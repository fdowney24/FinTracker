import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { TransactionProvider } from './src/context/TransactionContext';
import HomeScreen from './src/screens/HomeScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';
import MonthlySummaryScreen from './src/screens/MonthlySummaryScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import EditTransactionScreen from './src/screens/EditTransactionScreen';
import { COLORS } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { borderTopColor: COLORS.border, backgroundColor: COLORS.card },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home:         focused ? 'home'      : 'home-outline',
            Transactions: focused ? 'list'      : 'list-outline',
            Monthly:      focused ? 'bar-chart' : 'bar-chart-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionListScreen} />
      <Tab.Screen name="Monthly" component={MonthlySummaryScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TransactionProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddTransaction"
              component={AddTransactionScreen}
              options={{
                title: 'Add Transaction',
                headerStyle: { backgroundColor: COLORS.card },
                headerTintColor: COLORS.text,
              }}
            />
            <Stack.Screen
              name="EditTransaction"
              component={EditTransactionScreen}
              options={{
                title: 'Edit Transaction',
                headerStyle: { backgroundColor: COLORS.card },
                headerTintColor: COLORS.text,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TransactionProvider>
    </GestureHandlerRootView>
  );
}
