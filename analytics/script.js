console.log("Script loaded");

// Mock Video Data with YouTube URLs
const videoData = {
    1: { 
        title: "Video 1", 
        value: 2.45, 
        change: "+15%", 
        history: [2.0, 2.1, 2.2, 2.3, 2.45], 
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" 
    },
    2: { 
        title: "Video 2", 
        value: 3.20, 
        change: "+32%", 
        history: [2.8, 2.9, 3.0, 3.1, 3.20], 
        videoUrl: "https://www.youtube.com/embed/3tmd-Claq34" 
    },
    3: { 
        title: "Video 3", 
        value: 1.80, 
        change: "-5%", 
        history: [1.9, 1.95, 1.85, 1.82, 1.80], 
        videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0" 
    },
    4: { 
        title: "Video 4", 
        value: 4.50, 
        change: "+20%", 
        history: [4.0, 4.2, 4.3, 4.4, 4.50], 
        videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk" 
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
    const nodes = document.querySelectorAll('.video-node');
    
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

// Performance Chart
const chartCtx = document.getElementById('performanceChart');
if (!chartCtx) {
    console.error("Performance chart canvas not found");
} else {
    const performanceChart = new Chart(chartCtx.getContext('2d'), {
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
                y: { 
                    beginAtZero: true, 
                    ticks: { color: '#fff', callback: value => '$' + value } 
                },
                x: { ticks: { color: '#fff' } }
            },
            plugins: {
                legend: { labels: { color: '#fff' } }
            }
        }
    });

    // Time Slider
    const timeSlider = document.getElementById('timeSlider');
    timeSlider.addEventListener('input', (e) => {
        const index = parseInt(e.target.value);
        const videoId = document.getElementById('modalTitle').textContent.replace('Video ', '');
        const video = videoData[videoId];
        performanceChart.data.datasets[0].data = video.history.slice(0, index + 1);
        performanceChart.update();
    });

    // Node Click Interaction
    document.querySelectorAll('.video-node').forEach(node => {
        node.addEventListener('click', () => {
            const videoId = node.getAttribute('data-id');
            const video = videoData[videoId];

            node.classList.add('zoom');
            setTimeout(() => {
                node.classList.remove('zoom');

                performanceChart.data.datasets[0].data = video.history;
                performanceChart.update();

                document.getElementById('modalTitle').textContent = video.title;
                document.getElementById('videoValue').textContent = `$${video.value}`;
                document.getElementById('videoChange').textContent = video.change;
                document.getElementById('modalVideo').src = `${video.videoUrl}?autoplay=1`;
                document.getElementById('performanceModal').style.display = 'flex';

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

        node.addEventListener('mouseenter', () => {
            const iframe = node.querySelector('iframe');
            iframe.src = iframe.src + '&autoplay=1';
        });

        node.addEventListener('mouseleave', () => {
            const iframe = node.querySelector('iframe');
            iframe.src = iframe.src.replace('&autoplay=1', '');
        });
    });
}

// Leaderboard
function showLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    const leaderboardList = document.getElementById('leaderboardList');
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
    document.getElementById('leaderboard').style.display = 'none';
}

// Modal Close
function closeModal() {
    document.getElementById('performanceModal').style.display = 'none';
    document.getElementById('modalVideo').src = '';
    hideLeaderboard();
}