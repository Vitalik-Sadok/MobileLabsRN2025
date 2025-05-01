import React, { useState, useEffect, useCallback } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	ListRenderItemInfo,
	Alert,
	Button,
	Modal,
	TextInput,
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'

type FileSystemItem = {
	name: string
	uri: string
	isDirectory: boolean
}

const APP_DATA_DIR_NAME = 'AppData'
const appDataDirUri = FileSystem.documentDirectory + APP_DATA_DIR_NAME + '/'

export default function FileManagerScreen() {
	const [isLoading, setIsLoading] = useState(true)
	const [currentPath, setCurrentPath] = useState(appDataDirUri)
	const [directoryContent, setDirectoryContent] = useState<FileSystemItem[]>([])

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [newItemName, setNewItemName] = useState('')
	const [isCreatingFolder, setIsCreatingFolder] = useState(true)

	const loadDirectoryContent = useCallback(async (path: string) => {
		setIsLoading(true)
		
		try {
			const items = await FileSystem.readDirectoryAsync(path)
			const detailedItems: FileSystemItem[] = []

			for (const item of items) {
				const itemUri = path + item
				try {
					const info = await FileSystem.getInfoAsync(itemUri)

					if (info.exists) {
						detailedItems.push({
							name: item,
							uri: info.uri,
							isDirectory: info.isDirectory,
						})
					}
				} catch (itemError) {
					console.warn(`Could not get info for item ${itemUri}:`, itemError)
				}
			}

			detailedItems.sort((a, b) => {
				if (a.isDirectory !== b.isDirectory) {
					return a.isDirectory ? -1 : 1
				}
				return a.name.localeCompare(b.name)
			})

			console.log(
				'Detailed Content:',
				detailedItems.map(i => ({ name: i.name, isDirectory: i.isDirectory })),
			)
			setDirectoryContent(detailedItems)
			setCurrentPath(path)
		} catch (error) {
			setDirectoryContent([])
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		const setupDirectory = async () => {
			try {
				const dirInfo = await FileSystem.getInfoAsync(appDataDirUri)
				if (!dirInfo.exists) {
					await FileSystem.makeDirectoryAsync(appDataDirUri, {
						intermediates: true,
					})
				}
			} catch (error) {
				console.error('Error setting up directory:', error)
				setIsLoading(false)
				return
			}

			await loadDirectoryContent(appDataDirUri)
		}

		setupDirectory()
	}, [loadDirectoryContent])

	const handleItemPress = (item: FileSystemItem) => {
		if (item.isDirectory) {
			loadDirectoryContent(item.uri + '/')
		} else {
			if (item.name.endsWith('.txt')) {
				router.push({
					pathname: '/editor',
					params: { fileUri: item.uri, fileName: item.name },
				})
			}
		}
	}

	const openCreateModal = (creatingFolder: boolean) => {
		setIsCreatingFolder(creatingFolder)
		setNewItemName('')
		setIsModalVisible(true)
	}

	const handleCreateItem = async () => {
		if (!newItemName.trim()) {
			Alert.alert('Error', 'Please enter a name.')
			return
		}

		const newItemUri =
			currentPath + newItemName.trim() + (isCreatingFolder ? '/' : '.txt')

		try {
			const existingInfo = await FileSystem.getInfoAsync(newItemUri)
			if (existingInfo.exists) {
				Alert.alert(
					'Error',
					`An item named "${newItemName.trim()}" already exists.`,
				)
				return
			}

			if (isCreatingFolder) {
				await FileSystem.makeDirectoryAsync(newItemUri)
				Alert.alert('Success', `Folder "${newItemName.trim()}" created.`)
			} else {
				await FileSystem.writeAsStringAsync(newItemUri, '')
				Alert.alert('Success', `File "${newItemName.trim()}.txt" created.`)
			}

			setIsModalVisible(false)
			await loadDirectoryContent(currentPath)
		} catch (error: any) {
			console.error('Error creating item:', error)
			Alert.alert(
				'Creation Error',
				error.message || 'Failed to create item.',
			)
		}
	}

	const handleGoUp = () => {
		if (
			currentPath !== appDataDirUri &&
			currentPath.length > appDataDirUri.length
		) {
			const parentPath = currentPath
				.substring(0, currentPath.length - 1)
				.substring(
					0,
					currentPath.substring(0, currentPath.length - 1).lastIndexOf('/') + 1,
				)

			loadDirectoryContent(parentPath)
		} else {
			console.log('Already at the root AppData directory')
		}
	}

	const renderListItem = ({ item }: ListRenderItemInfo<FileSystemItem>) => (
		<TouchableOpacity onPress={() => handleItemPress(item)}>
			<View style={styles.listItem}>
				<Ionicons
					name={item.isDirectory ? 'folder-outline' : 'document-outline'}
					size={24}
					color={item.isDirectory ? '#FFCA28' : '#42A5F5'}
					style={styles.icon}
				/>
				<Text style={styles.itemName}>{item.name}</Text>
			</View>
		</TouchableOpacity>
	)

	const displayPath = currentPath.replace(
		FileSystem.documentDirectory || '',
		'',
	)

	return (
		<View style={styles.container}>
			{currentPath !== appDataDirUri && (
				<TouchableOpacity onPress={handleGoUp} style={styles.goUpButton}>
					<Ionicons name='arrow-up-outline' size={20} color='#555' />
					<Text style={styles.goUpText}> Go up one level</Text>
				</TouchableOpacity>
			)}
			<Text style={styles.pathText}>Path: {displayPath}</Text>

			{isLoading ? (
				<View style={styles.centered}>
					<ActivityIndicator size='large' />
				</View>
			) : (
				<FlatList
					data={directoryContent}
					renderItem={renderListItem}
					keyExtractor={item => item.uri}
					ListEmptyComponent={
						<Text style={styles.emptyText}>Folder is empty</Text>
					}
					style={{ flex: 1 }}
				/>
			)}

			<View style={styles.actionButtonsContainer}>
				<Button title='Create folder' onPress={() => openCreateModal(true)} />
				<Button title='Create file' onPress={() => openCreateModal(false)} />
			</View>

			<Modal
				animationType='slide'
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => setIsModalVisible(false)}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>
							{isCreatingFolder ? 'Create a new folder' : 'Create a new file'}
						</Text>
						<TextInput
							style={styles.input}
							placeholder={
								isCreatingFolder ? 'Folder name' : 'File name (without .txt)'
							}
							value={newItemName}
							onChangeText={setNewItemName}
							autoCapitalize='none'
							autoFocus={true}
						/>
						<View style={styles.modalButtons}>
							<Button
								title='Cancel'
								onPress={() => setIsModalVisible(false)}
								color='gray'
							/>
							<Button title='Create' onPress={handleCreateItem} />
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	goUpButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 10,
		marginBottom: 5,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	goUpText: {
		fontSize: 14,
		color: '#555',
	},
	pathText: {
		fontSize: 12,
		color: 'gray',
		paddingHorizontal: 10,
		paddingBottom: 10,
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	icon: {
		marginRight: 15,
	},
	itemName: {
		fontSize: 16,
	},
	emptyText: {
		textAlign: 'center',
		marginTop: 50,
		color: 'gray',
	},
	actionButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10,
		borderTopWidth: 1,
		borderTopColor: '#eee',
		backgroundColor: '#f8f8f8',
	},
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		width: '80%',
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 20,
		alignItems: 'stretch',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
		textAlign: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginBottom: 20,
		fontSize: 16,
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
})
