import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ListRenderItemInfo,
} from 'react-native'
import { useTasks } from '../context/TasksContext'
import { Task } from '../types/index'
import { TaskItem } from '../components/TaskItem'

export default function TasksScreen() {
	const { tasks } = useTasks()

	const renderTask = ({ item }: ListRenderItemInfo<Task>) => (
		<TaskItem task={item} />
	)

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Завдання</Text>
			<FlatList
				data={tasks}
				renderItem={renderTask}
				keyExtractor={item => item.id}
				style={styles.list}
				contentContainerStyle={styles.listContent}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f9fafc',
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: '#1e1e1e',
		marginBottom: 24,
		textAlign: 'center',
	},
	list: {
		flex: 1,
	},
	listContent: {
		paddingBottom: 30,
		gap: 12,
	},
})

