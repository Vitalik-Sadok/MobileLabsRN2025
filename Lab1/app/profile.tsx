import React, { useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Button,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from 'react-native'

export default function ProfileScreen() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [lastName, setLastName] = useState('')
	const [firstName, setFirstName] = useState('')

	const handleRegister = () => {
		if (!email || !password || !confirmPassword || !lastName || !firstName) {
			Alert.alert('Помилка', 'Будь ласка, заповніть усі поля')
			return
		}
		if (password !== confirmPassword) {
			Alert.alert('Помилка', 'Паролі не співпадають')
			return
		}

		Alert.alert('Успіх', 'Ви успішно зареєстровані!')
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.keyboardAvoidingContainer}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Text style={styles.title}>Реєстрація</Text>

				<Text style={styles.label}>Електронна пошта</Text>
				<TextInput
					style={styles.input}
					value={email}
					onChangeText={setEmail}
					keyboardType='email-address'
					autoCapitalize='none'
					placeholder='example@domain.com'
				/>

				<Text style={styles.label}>Пароль</Text>
				<TextInput
					style={styles.input}
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					placeholder='********'
				/>

				<Text style={styles.label}>Пароль (ще раз)</Text>
				<TextInput
					style={styles.input}
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					secureTextEntry
					placeholder='********'
				/>

				<Text style={styles.label}>Прізвище</Text>
				<TextInput
					style={styles.input}
					value={lastName}
					onChangeText={setLastName}
					placeholder='Ваше прізвище'
				/>

				<Text style={styles.label}>Ім'я</Text>
				<TextInput
					style={styles.input}
					value={firstName}
					onChangeText={setFirstName}
					placeholder="Ваше ім'я"
				/>

				<View style={styles.buttonContainer}>
					<Button
						title='Зареєструватися'
						onPress={handleRegister}
						color='#007bff'
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	keyboardAvoidingContainer: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 30,
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
		color: '#333',
	},
	input: {
		backgroundColor: '#f0f0f0',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 5,
		paddingHorizontal: 15,
		paddingVertical: 10,
		fontSize: 16,
		marginBottom: 15,
	},
	buttonContainer: {
		marginTop: 20,
		borderRadius: 5,
		overflow: 'hidden',
	},
})
