import { GalleryItem } from '@/src/components/GalleryItem'
import React from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'

const galleryData = Array.from({ length: 10 }, (_, i) => ({
	id: `gallery-${i}`,
}))

export default function GalleryScreen() {
	return (
		<View style={styles.container}>
			<FlatList
				data={galleryData}
				renderItem={({ item }) => <GalleryItem id={item.id} />}
				keyExtractor={item => item.id}
				numColumns={2}
				contentContainerStyle={styles.listContainer}
				ListHeaderComponent={<Text style={styles.title}>Фотогалерея</Text>}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	listContainer: {
		paddingHorizontal: 10,
		paddingTop: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 10,
		textAlign: 'center',
	},
})
