import type { Unsubscribe } from 'firebase/auth'
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { db } from '~/config/firebase'

import type { ITodo } from '~/interfaces/todo'

let unsubscribe: Unsubscribe | null = null

export const useTodos = () => {
	const todos = useState<ITodo[]>('todos', () => [])
	const isDisabled = ref(false)
	const isLoading = ref(false)
	const toast = useToast()
	const { user } = useUserStore()

	onMounted(async () => {
		if (user) {
			unsubscribe = onSnapshot(
				query(collection(db, 'todos'), where('userId', '==', user.id)),
				(snapshot) => {
					isLoading.value = true
					todos.value = snapshot.docs.map((doc) =>
						doc.data(),
					) as ITodo[]
					isLoading.value = false
				},
				(error) => {
					console.error('Error fetching todos:', error)
					isLoading.value = false
				},
			)
		}
	})

	onUnmounted(() => {
		if (unsubscribe) {
			unsubscribe()
		}
	})

	const createTodo = async (
		todo: Omit<ITodo, 'id' | 'isComplete' | 'userId'>,
	) => {
		try {
			isDisabled.value = true
			const id = uuidv4()

			await setDoc(doc(db, 'todos', id), {
				...todo,
				id,
				isComplete: false,
				userId: user?.id,
			})
		} catch (error) {
			console.trace(error)
			toast.add({
				title: 'Create todo failed',
				description:
					error instanceof Error ? error.message : 'Unknown error',
				color: 'error',
			})
		} finally {
			isDisabled.value = false
		}
	}

	const updateTodo = async (id: string, todo: Partial<ITodo>) => {
		try {
			isDisabled.value = true
			await updateDoc(doc(db, 'todos', id), todo)
		} catch (error) {
			console.trace(error)
			toast.add({
				title: 'Update todo failed',
				description:
					error instanceof Error ? error.message : 'Unknown error',
				color: 'error',
			})
		} finally {
			isDisabled.value = false
		}
	}

	const deleteTodo = async (id: string) => {
		try {
			isDisabled.value = true
			await deleteDoc(doc(db, 'todos', id))
		} catch (error) {
			console.trace(error)
			toast.add({
				title: 'Delete todo failed',
				description:
					error instanceof Error ? error.message : 'Unknown error',
				color: 'error',
			})
		} finally {
			isDisabled.value = false
		}
	}

	return { todos, createTodo, updateTodo, deleteTodo, isDisabled, isLoading }
}
