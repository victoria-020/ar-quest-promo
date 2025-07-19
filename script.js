mapboxgl.accessToken = 'pk.eyJ1IjoidmljdG9yaWEtOSIsImEiOiJjbWRhNXltZGIwY3IxMm1zZ2dhZ3F2eWl3In0.MW4pUoKhf-8f-sEar6WaTA'; 

const appState = {
  quests: [
    {
      id: 1,
      title: 'Объект 1',
      coordinates: [56.2294, 58.0104],
      previewImg: 'img/preview1.jpg',
      taskImg: 'img/task1.jpg',
      targetBox: { x: 150, y: 120, width: 100, height: 80 },
      finalImg: 'img/found1.jpg',
      rewardImg: 'img/reward1.png',
      completed: false,
    },
    {
      id: 2,
      title: 'Объект 2',
      coordinates: [56.2308, 58.0117],
      previewImg: 'img/preview2.jpg',
      taskImg: 'img/task2.jpg',
      targetBox: { x: 180, y: 100, width: 80, height: 60 },
      finalImg: 'img/found2.jpg',
      rewardImg: 'img/reward2.png',
      completed: false,
    }
  ],
  activeQuest: null,
  achievements: []
};

// --- ИНИЦИАЛИЗАЦИЯ КАРТЫ ---
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [56.2294, 58.0104],
  zoom: 15
});

map.on('load', () => {
  appState.quests.forEach(q => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.innerText = q.title;
    el.addEventListener('click', () => startQuest(q.id));
    mapboxgl.Marker({ element: el }).setLngLat(q.coordinates).addTo(map);
  });
});

// --- НАЧАТЬ КВЕСТ ---
function startQuest(id) {
  appState.activeQuest = appState.quests.find(q => q.id === id);
  if (!appState.activeQuest || appState.activeQuest.completed) return;
  showScreen('camera');

  // MVP: через 5 секунд — имитируем "сканирование"
  setTimeout(() => {
    showScreen('task');
    loadTaskImage();
  }, 5000);
}

// --- ПОКАЗАТЬ ПОПАП-ПОДСКАЗКУ ---
document.getElementById('show-hint').addEventListener('click', () => {
  showScreen('popup');
});

document.getElementById('popup-continue').addEventListener('click', () => {
  showScreen('camera');
});

// --- НАСТРОЙКА КАРТИНКИ ЗАДАНИЯ ---
function loadTaskImage() {
  const quest = appState.activeQuest;
  const taskImg = document.getElementById('task-img');
  taskImg.src = quest.taskImg;

  const overlay = document.createElement('div');
  overlay.className = 'click-box';
  overlay.style.left = `${quest.targetBox.x}px`;
  overlay.style.top = `${quest.targetBox.y}px`;
  overlay.style.width = `${quest.targetBox.width}px`;
  overlay.style.height = `${quest.targetBox.height}px`;

  overlay.addEventListener('click', () => {
    showScreen('found');
    document.getElementById('found-img').src = quest.finalImg;
  });

  const container = document.getElementById('task-container');
  container.innerHTML = '';
  container.appendChild(taskImg);
  container.appendChild(overlay);
}

// --- ПОЛУЧИТЬ АЧИВКУ ---
document.getElementById('get-reward').addEventListener('click', () => {
  const quest = appState.activeQuest;
  document.getElementById('reward-img').src = quest.rewardImg;
  showScreen('reward');
});

// --- ЗАБРАТЬ НАГРАДУ ---
document.getElementById('claim-reward').addEventListener('click', () => {
  const quest = appState.activeQuest;
  quest.completed = true;
  appState.achievements.push(quest.rewardImg);
  updateGarageBadge();
  appState.activeQuest = null;
  showScreen('map');
});

// --- БЭДЖ НА ГАРАЖ ---
function updateGarageBadge() {
  const btn = document.getElementById('garage-btn');
  btn.innerText = `Гараж ачивок (${appState.achievements.length})`;
}

// --- ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ ---
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(el => el.style.display = 'none');
  document.getElementById(screenId).style.display = 'block';
}

// --- ПРИ ЗАГРУЗКЕ ---
window.onload = () => {
  showScreen('splash');
  setTimeout(() => showScreen('map'), 2000); // splash -> карта
};
