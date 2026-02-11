interface FetchResponse {
    users: User[];
    posts: Post[];
    todos: Todo[];
}

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

interface Todo {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
}

const fetchWithRetry = async <T>(url: string, retries: number = 3): Promise<T> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            if (Math.random() < 0.1) throw new Error("Erro simulado");
            return response.json();
        } catch (error) {
            console.log(`Erro ao buscar ${url}: ${error}`);
        }
    }
    throw new Error(`Erro: não foi possível buscar ${url}`);
}

const main = async () => {
    try {
        return await Promise.all([
            fetchWithRetry<User[]>("https://jsonplaceholder.typicode.com/users"),
            fetchWithRetry<Post[]>("https://jsonplaceholder.typicode.com/posts"),
            fetchWithRetry<Todo[]>("https://jsonplaceholder.typicode.com/todos")
    ]);
    } 
    catch (error) {
        console.log(error);
    }
}
const data = main();