console.log("Script loaded");

// Mock Video Data with Additional Fields
const videoData = {
    1: { 
        title: "Video 1", 
        value: 2.45, 
        change: "+15%", 
        history: [2.0, 2.1, 2.2, 2.3, 2.45], 
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "Music",
        views: 1200000
    },
    2: { 
        title: "Video 2", 
        value: 3.20, 
        change: "+32%", 
        history: [2.8, 2.9, 3.0, 3.1, 3.20], 
        videoUrl: "https://www.youtube.com/embed/3tmd-Claq34",
        type: "Gaming",
        views: 2500000
    },
    3: { 
        title: "Video 3", 
        value: 1.80, 
        change: "-5%", 
        history: [1.9, 1.95, 1.85, 1.82, 1.80], 
        videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
        type: "Music",
        views: 800000
    },
    4: { 
        title: "Video 4", 
        value: 4.50, 
        change: "+20%", 
        history: [4.0, 4.2, 4.3, 4.4, 4.50], 
        videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
        type: "Entertainment",
        views: 3100000
    }
};

// Web Canvas for 3D Lines
const canvas = document.getElementById('webCanvas');
const ctx = canvas.getContext('2d');
const webContainer = document.querySelector('.web-container');

if (!canvas || !ctx || !webContainer) {
    console.error("Canvas or container not found");
}

function resizeCanvas() {
    canvas.width = webContainer.offsetWidth;
    canvas.height = webContainer.offsetHeight;
    console.log("Canvas resized to:", canvas.width, canvas.height);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

function drawWeb() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const nodes = document.querySelectorAll('.video-node:not(.hidden)');
    
    nodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - webContainer.getBoundingClientRect().left;
        const y = rect.top + rect.height / 2 - webContainer.getBoundingClientRect().top;
        const videoId = node.getAttribute('data-id');
        const change = videoData[videoId].change.includes('+') ? '#00cc66' : '#ff4444';

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = change;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 5;
        ctx.shadowColor = change;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);
    });

    requestAnimationFrame(drawWeb);
}

webContainer.addEventListener('mousemove', (e) => {
    const rect = webContainer.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});
drawWeb();

// Animation Transition Handler
function animateNodes(showNodes, hideNodes, callback) {
    hideNodes.forEach(node => {
        node.classList.add('animating');
        node.style.opacity = '0';
    });

    setTimeout(() => {
        hideNodes.forEach(node => {
            node.classList.add('hidden');
            node.classList.remove('animating');
            node.style.opacity = '';
        });

        showNodes.forEach(node => {
            node.classList.remove('hidden');
            node.classList.add('animating');
            node.style.opacity = '0';
            setTimeout(() => {
                node.style.opacity = '1';
                node.classList.remove('animating');
            }, 50);
        });

        if (callback) callback();
    }, 300);
}

// Search Functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const nodes = document.querySelectorAll('.video-node');
    const showNodes = [];
    const hideNodes = [];

    nodes.forEach(node => {
        const videoId = node.getAttribute('data-id');
        const video = videoData[videoId];
        const matches = video.title.toLowerCase().includes(query) || video.type.toLowerCase().includes(query);
        if (matches && node.classList.contains('hidden')) {
            showNodes.push(node);
        } else if (!matches && !node.classList.contains('hidden')) {
            hideNodes.push(node);
        }
    });

    animateNodes(showNodes, hideNodes);
});

// Category Lists
function populateCategories() {
    const videoTypesList = document.querySelector('#videoTypes ul');
    const mostPopularList = document.querySelector('#mostPopular ul');
    const mostEarningList = document.querySelector('#mostEarning ul');

    const types = [...new Set(Object.values(videoData).map(v => v.type))];
    types.forEach(type => {
        const li = document.createElement('li');
        li.textContent = type;
        li.addEventListener('click', () => filterByType(type));
        videoTypesList.appendChild(li);
    });

    const popularVideos = Object.values(videoData).sort((a, b) => b.views - a.views).slice(0, 3);
    popularVideos.forEach(video => {
        const li = document.createElement('li');
        li.textContent = `${video.title} (${(video.views / 1000000).toFixed(1)}M views)`;
        li.addEventListener('click', () => highlightVideo(video));
        mostPopularList.appendChild(li);
    });

    const earningVideos = Object.values(videoData).sort((a, b) => b.value - a.value).slice(0, 3);
    earningVideos.forEach(video => {
        const li = document.createElement('li');
        li.textContent = `${video.title} ($${video.value})`;
        li.addEventListener('click', () => highlightVideo(video));
        mostEarningList.appendChild(li);
    });
}

function filterByType(type) {
    const nodes = document.querySelectorAll('.video-node');
    const showNodes = [];
    const hideNodes = [];

    nodes.forEach(node => {
        const videoId = node.getAttribute('data-id');
        const video = videoData[videoId];
        if (video.type === type && node.classList.contains('hidden')) {
            showNodes.push(node);
        } else if (video.type !== type && !node.classList.contains('hidden')) {
            hideNodes.push(node);
        }
    });

    animateNodes(showNodes, hideNodes, () => {
        searchInput.value = '';
    });
}

function highlightVideo(video) {
    const nodes = document.querySelectorAll('.video-node');
    const showNodes = [];
    const hideNodes = [];

    nodes.forEach(node => {
        const videoId = node.getAttribute('data-id');
        if (videoId === String(Object.keys(videoData).find(k => videoData[k] === video)) && node.classList.contains('hidden')) {
            showNodes.push(node);
        } else if (videoId !== String(Object.keys(videoData).find(k => videoData[k] === video)) && !node.classList.contains('hidden')) {
            hideNodes.push(node);
        }
    });

    animateNodes(showNodes, hideNodes, () => {
        searchInput.value = '';
    });
}

populateCategories();

// Performance Chart
const chartCtx = document.getElementById('performanceChart');
let performanceChart;
if (!chartCtx) {
    console.error("Performance chart canvas not found");
} else {
    performanceChart = new Chart(chartCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Value ($)',
                data: [],
                borderColor: '#00cc66',
                backgroundColor: 'rgba(0, 204, 102, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, ticks: { color: '#fff', callback: value => '$' + value } },
                x: { ticks: { color: '#fff' } }
            },
            plugins: { legend: { labels: { color: '#fff' } } }
        }
    });

    const timeSlider = document.getElementById('timeSlider');
    timeSlider.addEventListener('input', (e) => {
        const index = parseInt(e.target.value);
        const videoId = document.getElementById('modalTitle').textContent.replace('Video ', '');
        const video = videoData[videoId];
        if (video) {
            performanceChart.data.datasets[0].data = video.history.slice(0, index + 1);
            performanceChart.update();
        }
    });
}

// Node Click and Hover Interactions
document.querySelectorAll('.video-node').forEach(node => {
    node.addEventListener('click', () => {
        const videoId = node.getAttribute('data-id');
        const video = videoData[videoId];

        node.classList.add('zoom');
        setTimeout(() => {
            node.classList.remove('zoom');

            if (performanceChart) {
                performanceChart.data.datasets[0].data = video.history;
                performanceChart.update();
            }

            document.getElementById('modalTitle').textContent = video.title;
            document.getElementById('videoValue').textContent = `$${video.value}`;
            document.getElementById('videoChange').textContent = video.change;
            document.getElementById('modalVideo').src = `${video.videoUrl}?autoplay=1`;
            document.getElementById('performanceModal').style.display = 'flex';

            showTab('analytics');
            showLeaderboard();

            if (video.value > 3) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#00cc66', '#fff']
                });
            }
        }, 400);
    });

    // Hover effect for video title
    node.addEventListener('mouseenter', () => {
        const videoId = node.getAttribute('data-id');
        const titleElement = node.querySelector('.video-title');
        if (titleElement) {
            titleElement.style.opacity = '1'; // Fade in
        }
    });

    node.addEventListener('mouseleave', () => {
        const titleElement = node.querySelector('.video-title');
        if (titleElement) {
            titleElement.style.opacity = '0'; // Fade out
        }
    });
});

// Tab Switching
function showTab(tabName) {
    const analyticsTab = document.getElementById('analyticsTab');
    const videoTab = document.getElementById('videoTab');
    const buttons = document.querySelectorAll('.tab-button');

    if (tabName === 'analytics') {
        analyticsTab.classList.add('active');
        videoTab.classList.remove('active');
    } else {
        analyticsTab.classList.remove('active');
        videoTab.classList.add('active');
    }

    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.onclick.toString().includes(tabName));
    });
}

// Leaderboard
function showLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    const leaderboardList = document.getElementById('leaderboardList');

    if (!leaderboard || !leaderboardList) {
        console.error("Leaderboard elements not found");
        return;
    }

    leaderboardList.innerHTML = '';
    const sortedVideos = Object.values(videoData).sort((a, b) => b.value - a.value);
    sortedVideos.forEach(video => {
        const li = document.createElement('li');
        li.textContent = `${video.title}: $${video.value} (${video.change})`;
        li.style.color = video.change.includes('+') ? '#00cc66' : '#ff4444';
        leaderboardList.appendChild(li);
    });

    leaderboard.style.display = 'block';
}

function hideLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    if (leaderboard) {
        leaderboard.style.display = 'none';
    }
}

// Modal Close
function closeModal() {
    document.getElementById('performanceModal').style.display = 'none';
    document.getElementById('modalVideo').src = '';
    hideLeaderboard();
}