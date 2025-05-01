import { GalleryItemType } from '../types/index'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'

export const GalleryItem = ({ id }: GalleryItemType) => {
	const { width } = useWindowDimensions()

	const itemSize = width / 2 - 20

	return (
		<View style={[styles.galleryItem, { width: itemSize, height: itemSize }]}>
			<Text>{id}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	galleryItem: {
		backgroundColor: '#ccc',
		margin: 5,
		borderRadius: 5,
	},
})
