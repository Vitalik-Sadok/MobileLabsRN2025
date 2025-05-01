import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ScrollView,
	ActivityIndicator,
	Alert,
	Button, 
	Platform,
} from 'react-native'
import { useLocalSearchParams, Stack, useNavigation } from 'expo-router' 
import * as FileSystem from 'expo-file-system'

export default function EditorScreen() {
	const [isLoading, setIsLoading] = useState(true)
	const [fileContent, setFileContent] = useState('')
	const [originalContent, setOriginalContent] = useState('')
	const [isDirty, setIsDirty] = useState(false) 
	const [error, setError] = useState<string | null>(null)

	const { fileUri, fileName } = useLocalSearchParams<{
		fileUri: string
		fileName: string
	}>()
	const navigation = useNavigation()

	useEffect(() => {
		const loadFileContent = async () => {
			if (!fileUri) {
				setError('Failed to retrieve the file path.')
				setIsLoading(false)

				return
			}

			try {
				const content = await FileSystem.readAsStringAsync(fileUri)

				setFileContent(content)
				setError(null)
			} catch (err: any) {
				setError('Failed to read the file: ' + err.message)
			} finally {
				setIsLoading(false)
			}
		}

		loadFileContent()
	}, [fileUri])

	const handleSaveFile = useCallback(async () => {
		if (!fileUri) {
			Alert.alert('Error', 'No path for saving the file.')
			return
		}

		try {
			await FileSystem.writeAsStringAsync(fileUri, fileContent)

			setOriginalContent(fileContent)
			setIsDirty(false)

			navigation.goBack()
		} catch (err: any) {
			console.error('Error saving file:', err)
		}
	}, [fileUri, fileContent, navigation])

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				isDirty ? <Button onPress={handleSaveFile} title='Save' /> : null,
		})
	}, [navigation, handleSaveFile, isDirty])

	const handleTextChange = (text: string) => {
		setFileContent(text)
		setIsDirty(text !== originalContent)
	}

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' />
				<Text>Loading file...</Text>
			</View>
		)
	}

	if (error) {
		return (
			<View style={styles.centered}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		)
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.scrollContentContainer}>
			<Stack.Screen options={{ title: fileName || 'Editor' }} />
			<TextInput
				style={styles.textInput}
				value={fileContent}
				onChangeText={handleTextChange}
				multiline={true}
				textAlignVertical='top'
				scrollEnabled={false}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContentContainer: {
		flexGrow: 1,
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
	},

	textInput: {
		flex: 1,
		minHeight: 300,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		fontSize: 16,
		fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
	},
})
