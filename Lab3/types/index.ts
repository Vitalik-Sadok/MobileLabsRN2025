export enum TaskType {
	CLICKS = 'CLICKS',
	DOUBLE_CLICKS = 'DOUBLE_CLICKS',
	LONG_PRESS_DURATION = 'LONG_PRESS_DURATION',
	PAN = 'PAN',
	FLING_RIGHT = 'FLING_RIGHT',
	FLING_LEFT = 'FLING_LEFT',
	FLING_ANY = 'FLING_ANY',
	PINCH = 'PINCH',
	SCORE = 'SCORE',
}

export type Task = {
	id: string
	type: TaskType
	description: string
	targetValue: number
	currentValue: number
	isCompleted: boolean
}
