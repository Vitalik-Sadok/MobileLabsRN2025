import React from 'react'
import { Tabs } from 'expo-router'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function TabLayout() {
	return (
		<View style={styles.layoutContainer}>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: 'blue',
					tabBarInactiveTintColor: 'gray',
					headerStyle: {
						backgroundColor: '#f8f8f8',
					},
					headerTitleAlign: 'center',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
					headerTitle: 'First-Mobile-App',
				}}>
				<Tabs.Screen
					name='index'
					options={{
						title: 'Головна',
						tabBarIcon: ({ color }) => (
							<FontAwesome size={28} name='home' color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='gallery'
					options={{
						title: 'Фотогалерея',
						tabBarIcon: ({ color }) => (
							<FontAwesome size={28} name='picture-o' color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name='profile'
					options={{
						title: 'Профіль',
						tabBarIcon: ({ color }) => (
							<FontAwesome size={28} name='user' color={color} />
						),
					}}
				/>
			</Tabs>

			<View style={styles.footer}>
				<Text style={styles.footerText}>Sadolinskiy Vitaliy ІПЗ-21-5</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	layoutContainer: {
		flex: 1,
	},
	footer: {
		backgroundColor: '#f8f8f8',
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderTopWidth: 1,
		borderTopColor: '#ddd',
	},
	footerText: {
		fontSize: 12,
		color: 'gray',
		textAlign: 'center',
	},
})
