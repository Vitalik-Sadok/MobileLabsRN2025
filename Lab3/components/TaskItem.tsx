import { View, Text, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Task } from '../types/index'

type TaskItemProps = {
	task: Task
}

export const TaskItem = ({ task }: TaskItemProps) => {
	const showProgress = task.targetValue > 1

	const containerStyle = [
		styles.taskContainerBase,
		task.isCompleted
			? styles.taskContainerCompleted
			: styles.taskContainerPending,
	]
	const descriptionStyle = [
		styles.taskDescriptionBase,
		task.isCompleted
			? styles.taskDescriptionCompleted
			: styles.taskDescriptionPending,
	]
	const progressStyle = [
		styles.taskProgressBase,
		task.isCompleted
			? styles.taskProgressCompleted
			: styles.taskProgressPending,
	]
	const iconColor = task.isCompleted ? 'green' : 'gray'

	return (
		<View style={containerStyle}>
			<Ionicons
				name={task.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
				size={24}
				color={iconColor}
				style={styles.iconStyle}
			/>
			<View style={styles.taskTextContainer}>
				<Text style={descriptionStyle}>{task.description}</Text>
				{showProgress && !task.isCompleted && (
					<Text style={progressStyle}>
						Прогрес: {task.currentValue} / {task.targetValue}
					</Text>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	taskContainerBase: {
		padding: 15,
		marginBottom: 10,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},
	taskContainerPending: {
		backgroundColor: '#f0f0f0',
		opacity: 1.0,
	},
	taskContainerCompleted: {
		backgroundColor: '#e0ffe0',
		opacity: 0.7,
	},
	iconStyle: {
		marginRight: 15,
	},
	taskTextContainer: {
		flex: 1,
		marginRight: 10,
	},
	taskDescriptionBase: {
		fontSize: 16,
	},
	taskDescriptionPending: {
		color: '#333',
		textDecorationLine: 'none',
	},
	taskDescriptionCompleted: {
		color: 'gray',
		textDecorationLine: 'line-through',
	},
	taskProgressBase: {
		fontSize: 12,
		marginTop: 3,
	},
	taskProgressPending: {
		color: '#666',
	},
	taskProgressCompleted: {
		color: 'gray',
	},
})
