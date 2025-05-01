import { ComponentProps } from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { TasksProvider } from '../context/TasksContext'

function TabLayout() {
	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerTitleAlign: 'center',
				tabBarIcon: ({ focused, color, size }) => {
					let iconName: ComponentProps<typeof Ionicons>['name'] = 'alert-circle'

					if (route.name === 'index') {
						iconName = focused ? 'game-controller' : 'game-controller-outline'
					} else if (route.name === 'tasks') {
						iconName = focused ? 'list-circle' : 'list-circle-outline'
					}

					return <Ionicons name={iconName} size={size} color={color} />
				},
				tabBarActiveTintColor: 'blue',
				tabBarInactiveTintColor: 'gray',
			})}>
			<Tabs.Screen name='index' options={{ title: 'Гра' }} />
			<Tabs.Screen name='tasks' options={{ title: 'Завдання' }} />
		</Tabs>
	)
}

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={styles.container}>
			<TasksProvider>
				<TabLayout />
			</TasksProvider>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
