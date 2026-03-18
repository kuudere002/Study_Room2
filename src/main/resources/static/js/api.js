// src/main/resources/static/js/api.js

const API = {
    // ---- 用户鉴权 ----
    async login(username, password) {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return res;
    },

    async register(formData) {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        return res;
    },

    // ---- 待办事项 ----
    async getTodos(userId) {
        const res = await fetch(`/api/todo?userId=${userId}`);
        return await res.json();
    },

    async addTodo(userId, content) {
        const res = await fetch('/api/todo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, content })
        });
        return await res.json();
    },

    async toggleTodo(todo) {
        return await fetch(`/api/todo/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: todo.content,
                completed: todo.completed === 1 ? 0 : 1
            })
        });
    },

    async deleteTodo(id) {
        return await fetch(`/api/todo/${id}`, { method: 'DELETE' });
    },

    // ---- 专注记录 ----
    async saveFocusRecord(data) {
        return await fetch('/api/focus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    async getFocusHistory(userId) {
        const res = await fetch(`/api/focus/history?userId=${userId}`);
        return await res.json();
    }
};
