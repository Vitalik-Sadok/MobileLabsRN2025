import { View, Text, StyleSheet, Alert } from 'react-native'
import {
	Directions,
	Gesture,
	GestureDetector,
} from 'react-native-gesture-handler'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	runOnJS,
	withSpring,
} from 'react-native-reanimated'
import { useTasks } from '../context/TasksContext'
import { TaskType } from '../types/index'
import { useState } from 'react'

const SINGLE_TAP_POINTS = 1
const DOUBLE_TAP_POINTS = SINGLE_TAP_POINTS * 2
const LONG_PRESS_POINTS = 5
const LONG_PRESS_DURATION = 800 // milliseconds
const FLING_MAX_POINTS = 10
const PINCH_BONUS_POINTS = 15
const MAX_SCALE = 3
const MIN_SCALE = 0.5

export default function GameScreen() {
	const [score, setScore] = useState(0)
	const { updateTaskProgress, updateTotalScore } = useTasks()

	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)
	const startX = useSharedValue(0)
	const startY = useSharedValue(0)
	const scale = useSharedValue(1)
	const startScale = useSharedValue(1)

	const incrementScore = (points: number) => {
		const newScore = score + points
		setScore(newScore)
		updateTotalScore(newScore)
	}

	const showAlert = (title: string, message: string) => {
		Alert.alert(title, message)
	}

	const singleTap = Gesture.Tap()
		.numberOfTaps(1)
		.onEnd((_event, success) => {
			if (!success) return

			runOnJS(incrementScore)(SINGLE_TAP_POINTS)
			runOnJS(updateTaskProgress)(TaskType.CLICKS, 1)
		})

	const doubleTap = Gesture.Tap()
		.numberOfTaps(2)
		.onEnd((_event, success) => {
			if (!success) return

			runOnJS(incrementScore)(DOUBLE_TAP_POINTS)
			runOnJS(updateTaskProgress)(TaskType.DOUBLE_CLICKS, 1)
		})

	const longPress = Gesture.LongPress()
		.minDuration(LONG_PRESS_DURATION)
		.onEnd((_event, success) => {
			if (!success) return

			runOnJS(incrementScore)(LONG_PRESS_POINTS)
			runOnJS(updateTaskProgress)(TaskType.LONG_PRESS_DURATION, 1)
			runOnJS(showAlert)('Бонус!', `+${LONG_PRESS_POINTS} очок за утримання!`)
		})

	const pan = Gesture.Pan()
		.onBegin(() => {
			startX.value = translateX.value
			startY.value = translateY.value
		})
		.onChange(event => {
			translateX.value = startX.value + event.translationX
			translateY.value = startY.value + event.translationY
		})
		.onEnd((event, success) => {
			if (success) {
				const distance = Math.sqrt(
					event.translationX ** 2 + event.translationY ** 2,
				)
				if (distance > 10) {
					runOnJS(updateTaskProgress)(TaskType.PAN, 1)
				}
			}
		})

	const fling = Gesture.Fling()
		.direction(
			Directions.RIGHT | Directions.LEFT | Directions.UP | Directions.DOWN,
		)
		.onEnd((_event, success) => {
			if (!success) return

			const randomPoints = Math.floor(Math.random() * FLING_MAX_POINTS) + 1

			runOnJS(incrementScore)(randomPoints)
			runOnJS(updateTaskProgress)(TaskType.FLING_ANY, 1)
			runOnJS(showAlert)('Свайп!', `+${randomPoints} випадкових очок!`)
		})

	const pinch = Gesture.Pinch()
		.onBegin(() => {
			startScale.value = scale.value
		})
		.onChange(event => {
			const newScale = startScale.value * event.scale

			scale.value = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE))
		})
		.onEnd(() => {
			if (scale.value !== 1) {
				runOnJS(incrementScore)(PINCH_BONUS_POINTS)
				runOnJS(updateTaskProgress)(TaskType.PINCH, 1)
				runOnJS(showAlert)(
					'Вау!',
					`+${PINCH_BONUS_POINTS} бонусних очок за зміну розміру!`,
				)
			}

			scale.value = withSpring(1)
		})

	const tapAndLongPressAndFling = Gesture.Exclusive(
		doubleTap,
		longPress,
		fling,
		singleTap,
	)
	const combinedGestures = Gesture.Simultaneous(
		tapAndLongPressAndFling,
		pan,
		pinch,
	)

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: translateX.value },
				{ translateY: translateY.value },
				{ scale: scale.value },
			],
		}
	})

	return (
		<View style={styles.container}>
			<Text style={styles.scoreText}>Очки: {score}</Text>
			<GestureDetector gesture={combinedGestures}>
				<Animated.View style={[styles.interactiveObject, animatedStyle]}>
					<Text style={styles.objectText}>Тисни!</Text>
				</Animated.View>
			</GestureDetector>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#f2f4f8',
	},
	scoreText: {
		fontSize: 28,
		fontWeight: '600',
		color: '#333',
		position: 'absolute',
		top: 40,
		alignSelf: 'center',
	},
	interactiveObject: {
		width: 160,
		height: 160,
		borderRadius: 80,
		backgroundColor: '#4a90e2',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 8,
	},
	objectText: {
		fontSize: 22,
		fontWeight: '700',
		color: '#fff',
	},
})

