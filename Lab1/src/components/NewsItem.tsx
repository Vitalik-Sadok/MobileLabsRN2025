import { View, Text, StyleSheet, FlatList } from 'react-native'
import { NewsItemType } from '../types/index'

export const NewsItem = ({ title, date, snippet }: NewsItemType) => (
	<View style={styles.newsItem}>
		<View style={styles.imagePlaceholder} />
		<View style={styles.newsTextContainer}>
			<Text style={styles.newsTitle}>{title}</Text>
			<Text style={styles.newsDate}>{date}</Text>
			<Text style={styles.newsSnippet}>{snippet}</Text>
		</View>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	newsItem: {
		flexDirection: 'row',
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 10,
		textAlign: 'center',
	},
	imagePlaceholder: {
		width: 60,
		height: 60,
		backgroundColor: '#ccc',
		marginRight: 15,
		borderRadius: 5,
	},
	newsTextContainer: {
		flex: 1,
	},
	newsTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 3,
	},
	newsDate: {
		fontSize: 12,
		color: 'gray',
		marginBottom: 5,
	},
	newsSnippet: {
		fontSize: 14,
	},
})
