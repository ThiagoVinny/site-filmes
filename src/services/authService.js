const KEY = "mock_users";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getUsers = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const saveUsers = (u) => localStorage.setItem(KEY, JSON.stringify(u));

export default {
    login: async (email, password) => {
        await delay(600);
        const users = getUsers();
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) return { error: "Credenciais inválidas" };
        const token = btoa(`${email}:${Date.now()}`);
        return { user: { id: user.id, email: user.email }, token };
    },

    register: async (email, password) => {
        await delay(600);
        const users = getUsers();
        if (users.find((u) => u.email === email)) return { error: "Email já cadastrado" };
        const id = Date.now();
        users.push({ id, email, password });
        saveUsers(users);
        const token = btoa(`${email}:${Date.now()}`);
        return { user: { id, email }, token };
    },

    recover: async (email) => {
        await delay(600);
        // Simula envio de email
        return { message: "Se o e-mail estiver cadastrado, você receberá instruções." };
    },
};
