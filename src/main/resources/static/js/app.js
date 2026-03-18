// src/main/resources/static/js/app.js

const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
    setup() {
        // ---- 视图与身份状态 ----
        const currentView = ref('auth'); // 'auth', 'dashboard', 'room'
        const isGuest = ref(false);
        const currentUser = ref(null);

        // ---- 企鹅动画状态 ----
        const isPasswordFocused = ref(false);
        const isInputFocused = ref(false);
        const eyeX = ref(0);
        const eyeY = ref(0);

        const onMouseMove = (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            eyeX.value = mouseX * 4;
            eyeY.value = mouseY * 4;
        };

        // ---- 登录注册表单 ----
        const authMode = ref('login');
        const authError = ref('');
        const loginForm = ref({ username: '', password: '' });
        const registerForm = ref({ username: '', password: '', nickname: '' });

        const handleLogin = async () => {
            try {
                const res = await API.login(loginForm.value.username, loginForm.value.password);
                const data = await res.json();
                if (res.ok) {
                    isGuest.value = false;
                    currentUser.value = data;
                    localStorage.setItem('user', JSON.stringify(data));
                    currentView.value = 'dashboard';
                    loadTodos();
                    loadFocusHistory();
                } else {
                    authError.value = data.error || '登录失败';
                }
            } catch (e) {
                authError.value = '网络错误';
            }
        };

        const handleGuestLogin = () => {
            isGuest.value = true;
            currentUser.value = { id: 0, username: 'guest', nickname: '神秘游客' };
            currentView.value = 'dashboard';
            todos.value = [];
            focusCount.value = 0;
            totalFocusMinutes.value = 0;
        };

        const handleRegister = async () => {
            try {
                const formData = { ...registerForm.value };
                if (!formData.nickname) formData.nickname = formData.username;
                const res = await API.register(formData);
                const data = await res.json();
                if (res.ok) {
                    authMode.value = 'login';
                    authError.value = '';
                    alert('注册成功，请登录');
                } else {
                    authError.value = data.error || '注册失败';
                }
            } catch (e) {
                authError.value = '网络错误';
            }
        };

        const logout = () => {
            currentUser.value = null;
            isGuest.value = false;
            currentView.value = 'auth';
            localStorage.removeItem('user');
            resetTimer();
        };

        // ---- 房间管理 ----
        const currentRoom = ref(null);
        const roomIcons = ['📚', '📖', '✏️', '💻', '🎯', '🌟'];
        const rooms = ref([
            { id: 1, name: '高效学习室', description: '适合深度学习', onlineUsers: 3, icon: '📚' },
            { id: 2, name: '考研自习室', description: '考研备考专用', onlineUsers: 5, icon: '📖' },
            { id: 3, name: '安静读书角', description: '安静阅读环境', onlineUsers: 2, icon: '✏️' },
            { id: 4, name: '编程工作坊', description: '代码学习交流', onlineUsers: 4, icon: '💻' },
            { id: 5, name: '考公加油站', description: '公务员考试备考', onlineUsers: 6, icon: '🎯' },
            { id: 6, name: '英语天地', description: '英语学习交流', onlineUsers: 3, icon: '🌟' }
        ]);

        const currentRoomData = computed(() => rooms.value.find(r => r.id === currentRoom.value));

        const joinRoom = (roomId) => {
            currentRoom.value = roomId;
            currentView.value = 'room';
            resetTimer();
        };

        const leaveRoom = () => {
            currentView.value = 'dashboard';
            currentRoom.value = null;
            resetTimer();
        };

        // ---- 待办事项 ----
        const todos = ref([]);
        const newTodo = ref('');

        const loadTodos = async () => {
            if (isGuest.value || !currentUser.value) return;
            try {
                todos.value = await API.getTodos(currentUser.value.id);
            } catch (e) {
                console.error('Failed to load todos');
            }
        };

        const addTodo = async () => {
            if (!newTodo.value.trim()) return;
            if (isGuest.value) {
                todos.value.unshift({
                    id: Date.now(),
                    content: newTodo.value,
                    completed: 0
                });
                newTodo.value = '';
                return;
            }
            try {
                const todo = await API.addTodo(currentUser.value.id, newTodo.value);
                todos.value.unshift(todo);
                newTodo.value = '';
            } catch (e) {
                console.error('Failed to add todo');
            }
        };

        const toggleTodo = async (todo) => {
            if (isGuest.value) {
                todo.completed = todo.completed === 1 ? 0 : 1;
                return;
            }
            try {
                await API.toggleTodo(todo);
                todo.completed = todo.completed === 1 ? 0 : 1;
            } catch (e) {
                console.error('Failed to update todo');
            }
        };

        const deleteTodo = async (id) => {
            if (isGuest.value) {
                todos.value = todos.value.filter(t => t.id !== id);
                return;
            }
            try {
                await API.deleteTodo(id);
                todos.value = todos.value.filter(t => t.id !== id);
            } catch (e) {
                console.error('Failed to delete todo');
            }
        };

        // ---- 计时器与统计 ----
        const presets = [15, 25, 30, 45];
        const selectedPreset = ref(25);
        const customMode = ref(false);
        const customHours = ref(0), customMinutes = ref(0), customSeconds = ref(0);
        const timerSeconds = ref(25 * 60);
        const timerRunning = ref(false), timerPaused = ref(false);
        const timerStatus = ref('准备开始');
        const timerStartedAt = ref(null);
        let timerInterval = null;

        const totalFocusMinutes = ref(0);
        const focusCount = ref(0);
        const avgFocusMinutes = computed(() => focusCount.value === 0 ? 0 : Math.round(totalFocusMinutes.value / focusCount.value));

        const formattedTime = computed(() => {
            const hours = Math.floor(timerSeconds.value / 3600);
            const minutes = Math.floor((timerSeconds.value % 3600) / 60);
            const seconds = timerSeconds.value % 60;
            if (hours > 0) return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        });

        const selectPreset = (preset) => {
            selectedPreset.value = preset;
            customMode.value = false;
            resetTimer();
        };

        const startTimer = () => {
            if (customMode.value || (customHours.value > 0 || customMinutes.value > 0 || customSeconds.value > 0)) {
                customMode.value = true;
                timerSeconds.value = customHours.value * 3600 + customMinutes.value * 60 + customSeconds.value;
                if (timerSeconds.value === 0) timerSeconds.value = selectedPreset.value * 60;
            } else {
                timerSeconds.value = selectedPreset.value * 60;
            }
            timerStartedAt.value = new Date().toISOString();
            timerRunning.value = true;
            timerPaused.value = false;
            timerStatus.value = '专注中...';

            timerInterval = setInterval(() => {
                if (timerSeconds.value > 0) timerSeconds.value--;
                else completeTimer();
            }, 1000);
        };

        const pauseTimer = () => {
            clearInterval(timerInterval);
            timerRunning.value = false;
            timerPaused.value = true;
            timerStatus.value = '已暂停';
        };

        const resetTimer = () => {
            clearInterval(timerInterval);
            timerRunning.value = false;
            timerPaused.value = false;
            timerStatus.value = '准备开始';
            timerSeconds.value = selectedPreset.value * 60;
            timerStartedAt.value = null;
        };

        const completeTimer = async () => {
            clearInterval(timerInterval);
            timerRunning.value = false;
            timerStatus.value = '完成！';

            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.3;
                oscillator.start();
                setTimeout(() => oscillator.stop(), 200);
            } catch(e) {}

            alert('🎉 恭喜完成一次专注！');

            if (currentRoom.value && timerStartedAt.value) {
                if (isGuest.value) {
                    focusCount.value++;
                    totalFocusMinutes.value += selectedPreset.value;
                } else {
                    try {
                        const res = await API.saveFocusRecord({
                            userId: currentUser.value.id,
                            roomId: currentRoom.value,
                            durationMinutes: selectedPreset.value,
                            startedAt: timerStartedAt.value
                        });
                        if (res.ok) loadFocusHistory();
                    } catch (e) {
                        console.error('Failed to save focus record');
                    }
                }
            }
            resetTimer();
        };

        const loadFocusHistory = async () => {
            if (isGuest.value || !currentUser.value) return;
            try {
                const data = await API.getFocusHistory(currentUser.value.id);
                focusCount.value = data.length;
                totalFocusMinutes.value = data.reduce((sum, r) => sum + r.durationMinutes, 0);
            } catch (e) {
                console.error('Failed to load focus history');
            }
        };

        watch([customHours, customMinutes, customSeconds], () => customMode.value = true);

        onMounted(() => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                currentUser.value = JSON.parse(savedUser);
                currentView.value = 'dashboard';
                loadTodos();
                loadFocusHistory();
            }
        });

        return {
            // Auth & Animation
            isPasswordFocused, isInputFocused, eyeX, eyeY, onMouseMove,
            currentUser, authMode, authError, loginForm, registerForm,
            handleLogin, handleRegister, handleGuestLogin, logout,
            // Routing
            currentView, isGuest,
            // Rooms
            joinRoom, leaveRoom, rooms, roomIcons, currentRoom, currentRoomData,
            // Todos
            todos, newTodo, addTodo, toggleTodo, deleteTodo,
            // Timer
            presets, selectedPreset, customMode, customHours, customMinutes, customSeconds,
            timerSeconds, timerRunning, timerPaused, timerStatus, formattedTime,
            selectPreset, startTimer, pauseTimer, resetTimer,
            // Stats
            totalFocusMinutes, focusCount, avgFocusMinutes
        };
    }
}).mount('#app');
