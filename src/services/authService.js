import { apiFetch } from "./api";

async function login(email, password) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    return data;
}

async function register(email, password) {
    const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    return data;
}

async function recover(email) {
    console.log("Recover solicitado para:", email);
    return { message: "Se o email existir, enviaremos instruções de recuperação." };
}

const authService = { login, register, recover };
export default authService;

export { login, register, recover };
