// src/main/resources/static/js/app.js

const { createApp, ref, computed, onMounted, watch } = Vue;

// ================= 高级音效合成引擎 (AudioEngine) =================
let audioCtx = null;

// 懒加载 AudioContext，避免浏览器禁止自动播放的策略拦截
const getAudioCtx = () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
};

const AudioEngine = {
    // 1. 柔和气泡音 (适合点击按钮、切换预设)
    playPop() {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = 'sine';
        // 频率快速下降产生"水滴"感
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

        // 音量快速衰减
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    },

    // 2. 清脆星空音 (适合勾选 Todo 任务完成)
    playSuccess() {
        const ctx = getAudioCtx();
        const playNote = (freq, delay) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.value = freq;

            gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
            gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.4);

            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.4);
        };
        // 快速弹奏一个大三和弦琶音，充满成就感
        playNote(880, 0);       // A5
        playNote(1108.73, 0.08); // C#6
        playNote(1318.51, 0.16); // E6
    },

    // 3. 冥想水晶颂钵音 (适合番茄钟结束，空灵、疗愈、不刺耳)
    playMeditationBell() {
        const ctx = getAudioCtx();
        const playBellComponent = (freq, volume, duration) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.value = freq;

            // 缓慢敲击与长达数秒的长尾混响包络线
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05); // 敲击瞬间
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // 悠长尾音

            osc.start();
            osc.stop(ctx.currentTime + duration);
        };

        // 核心技术：叠加基频与多个泛音，模拟真实的物理钟声共鸣
        const baseFreq = 432; // 432Hz 被认为是具有疗愈感的频率
        playBellComponent(baseFreq, 0.6, 5);          // 基频底音
        playBellComponent(baseFreq * 2.01, 0.3, 4);   // 第一泛音
        playBellComponent(baseFreq * 3.02, 0.15, 3);  // 第二泛音
        playBellComponent(baseFreq * 4.05, 0.08, 2);  // 高频清脆声
    }
};

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
            AudioEngine.playPop(); // 添加任务时的轻敲声

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
            // 预测本地状态
            const nextState = todo.completed === 1 ? 0 : 1;

            // 如果是由未完成变为完成，播放星空音；取消完成则播放气泡音
            if (nextState === 1) {
                AudioEngine.playSuccess();
            } else {
                AudioEngine.playPop();
            }

            if (isGuest.value) {
                todo.completed = nextState;
                return;
            }
            try {
                await API.toggleTodo(todo);
                todo.completed = nextState;
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
        const totalTimerSeconds = ref(25 * 60); // 保存当前番茄钟的总时间，用于计算进度
        const timerRunning = ref(false), timerPaused = ref(false);
        const timerStatus = ref('准备开始');
        const timerStartedAt = ref(null);
        let timerInterval = null;

        // SVG 霓虹圆环核心计算
        const radius = 166; // 圆环半径
        const circumference = ref(2 * Math.PI * radius); // 计算圆周长

        // 计算当前进度比例 (0 到 1)
        const timerProgress = computed(() => {
            if (!totalTimerSeconds.value) return 0;
            return 1 - (timerSeconds.value / totalTimerSeconds.value);
        });

        // 动态计算 SVG 线条的偏移量 (空环 -> 满环)
        const dashOffset = computed(() => {
            return circumference.value * (1 - timerProgress.value);
        });

        // 计算企鹅的旋转角度 (0 到 360 度)
        const penguinRotation = computed(() => {
            return timerProgress.value * 360;
        });

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
            AudioEngine.playPop(); // 切换预设时间时加入气泡音
            selectedPreset.value = preset;
            customMode.value = false;
            resetTimer();
        };

        const startTimer = () => {
            AudioEngine.playPop(); // 开始按钮音效

            if (!timerPaused.value) {
                if (customMode.value || (customHours.value > 0 || customMinutes.value > 0 || customSeconds.value > 0)) {
                    customMode.value = true;
                    timerSeconds.value = customHours.value * 3600 + customMinutes.value * 60 + customSeconds.value;
                    if (timerSeconds.value === 0) timerSeconds.value = selectedPreset.value * 60;
                } else {
                    timerSeconds.value = selectedPreset.value * 60;
                }
                totalTimerSeconds.value = timerSeconds.value;
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
            AudioEngine.playPop(); // 暂停按钮音效
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
            totalTimerSeconds.value = selectedPreset.value * 60;
            timerStartedAt.value = null;
        };

        const completeTimer = async () => {
            clearInterval(timerInterval);
            timerRunning.value = false;
            timerStatus.value = '完成！';

            // 确保进度条跑满
            timerSeconds.value = 0;

            // 播放清脆星空音！
            AudioEngine.playSuccess();

            // 延迟一点弹出提醒，不要阻断音效体验
            setTimeout(() => {
                alert('🎉 恭喜完成一次专注！');
            }, 500);

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
            setTimeout(() => resetTimer(), 2000); // 留出2秒时间让用户欣赏跑满的进度条
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

            // ================= 初始化像素风背景 =================
            const container = document.getElementById('particles');
            if (container) {
                container.innerHTML = ''; // 清空旧节点

                // 1. 生成 40 片像素雪花
                for (let i = 0; i < 40; i++) {
                    const snow = document.createElement('div');
                    snow.className = 'pixel-snow';
                    // 像素风的特点：大小必须是明确的倍数，不使用小数
                    const size = [3, 6, 9][Math.floor(Math.random() * 3)];
                    snow.style.width = `${size}px`;
                    snow.style.height = `${size}px`;

                    snow.style.left = Math.random() * 100 + '%';
                    snow.style.top = '-20px'; // 统一从顶部外侧出发

                    // 随机下落速度和起始延迟
                    snow.style.animationDuration = (8 + Math.random() * 15) + 's';
                    snow.style.animationDelay = '-' + (Math.random() * 20) + 's';
                    container.appendChild(snow);
                }

                // 2. 生成 5 朵缓慢飘动的像素云层
                for (let i = 0; i < 5; i++) {
                    const cloud = document.createElement('div');
                    cloud.className = 'pixel-cloud';

                    // 让云层错落分布在屏幕的上方 10% ~ 50% 的区域
                    cloud.style.top = (10 + Math.random() * 40) + '%';
                    // 云朵移动非常缓慢，营造悠闲感
                    cloud.style.animationDuration = (60 + Math.random() * 60) + 's';
                    cloud.style.animationDelay = '-' + (Math.random() * 100) + 's';

                    // 随机透明度来模拟远近：
                    cloud.style.opacity = (0.3 + Math.random() * 0.4).toString();

                    container.appendChild(cloud);
                }
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
            totalFocusMinutes, focusCount, avgFocusMinutes,
            // SVG Ring
            circumference, dashOffset, penguinRotation
        };
    }
}).mount('#app');
