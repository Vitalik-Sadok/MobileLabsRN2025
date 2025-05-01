import React, {
	createContext,
	useState,
	useContext,
	useMemo,
	useCallback,
} from 'react'
import { Task, TaskType } from '../types/index'

const initialTasks: Task[] = [
	{
		id: 't1',
		type: TaskType.CLICKS,
		description: 'Зробити 10 кліків',
		targetValue: 10,
		currentValue: 0,
		isCompleted: false,
	},
	{
		id: 't2',
		type: TaskType.DOUBLE_CLICKS,
		description: 'Зробити подвійний клік 5 разів',
		targetValue: 5,
		currentValue: 0,
		isCompleted: false,
	},
	{
		id: 't3',
		type: TaskType.LONG_PRESS_DURATION,
		description: "Утримувати об'єкт 3 секунди",
		targetValue: 1,
		currentValue: 0,
		isCompleted: false,
	},
	{
		id: 't4',
		type: TaskType.PAN,
		description: "Перетягнути об'єкт",
		targetValue: 1,
		currentValue: 0,
		isCompleted: false,
	},
	{
		id: 't5',
		type: TaskType.FLING_ANY,
		description: 'Зробити свайп (будь-який)',
		targetValue: 1,
		currentValue: 0,
		isCompleted: false,
	},
	{
		id: 't6',
		type: TaskType.PINCH,
		description: "Змінити розмір об'єкта",
		targetValue: 1,
		currentValue: 0,
		isCompleted: false,
	},
	{
		id: 't7',
		type: TaskType.SCORE,
		description: 'Отримати 100 очок',
		targetValue: 100,
		currentValue: 0,
		isCompleted: false,
	},
]

type TasksContextProps = {
	tasks: Task[]
	updateTaskProgress: (type: TaskType, value?: number) => void
	updateTotalScore: (score: number) => void
}

const TasksContext = createContext<TasksContextProps | undefined>(undefined)

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [tasks, setTasks] = useState<Task[]>(initialTasks)

	const updateTaskProgress = useCallback(
		(type: TaskType, value: number = 1) => {
			setTasks(currentTasks =>
				currentTasks.map(task => {
					if (task.type === type && !task.isCompleted) {
						const newCurrentValue = task.currentValue + value
						const isCompleted = newCurrentValue >= task.targetValue
						return {
							...task,
							currentValue: Math.min(newCurrentValue, task.targetValue),
							isCompleted: isCompleted,
						}
					}
					return task
				}),
			)
		},
		[],
	)

	const updateTotalScore = useCallback((score: number) => {
		setTasks(currentTasks =>
			currentTasks.map(task => {
				if (task.type === TaskType.SCORE && !task.isCompleted) {
					const isCompleted = score >= task.targetValue
					return {
						...task,
						currentValue: Math.min(score, task.targetValue),
						isCompleted: isCompleted,
					}
				}
				return task
			}),
		)
	}, [])

	const contextValue = useMemo(
		() => ({
			tasks,
			updateTaskProgress,
			updateTotalScore,
		}),
		[tasks, updateTaskProgress, updateTotalScore],
	)

	return (
		<TasksContext.Provider value={contextValue}>
			{children}
		</TasksContext.Provider>
	)
}

export const useTasks = (): TasksContextProps => {
	const context = useContext(TasksContext)
	if (!context) {
		throw new Error('useTasks must be used within a TasksProvider')
	}
	return context
}
