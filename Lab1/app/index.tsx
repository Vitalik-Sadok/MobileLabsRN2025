import { newsItems } from '@/data/mockData'
import { NewsItem } from '@/src/components/NewsItem'
import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			<FlatList
				data={newsItems}
				renderItem={({ item }) => (
					<NewsItem
						title={item.title}
						date={item.date}
						snippet={item.snippet}
						id={item.id}
					/>
				)}
				keyExtractor={item => item.id}
				ListHeaderComponent={<Text style={styles.title}>Новини</Text>}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 10,
		textAlign: 'center',
	},
})
