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

// Web Canvas for Mouse-Following Lines
const canvas = document.getElementById('webCanvas');
const ctx = canvas.getContext('2d');
const webContainer = document.querySelector('.web-container');

// Set canvas size explicitly
function resizeCanvas() {
    canvas.width = webContainer.offsetWidth;
    canvas.height = webContainer.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouseX = canvas.width / 2; // Default to center
let mouseY = canvas.height / 2;

function drawWeb() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const nodes = document.querySelectorAll('.video-node');
    
    nodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - webContainer.getBoundingClientRect().left;
        const y = rect.top + rect.height / 2 - webContainer.getBoundingClientRect().top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = 'rgba(0, 204, 102, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Mouse movement handler
webContainer.addEventListener('mousemove', (e) => {
    const rect = webContainer.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    drawWeb();
});

// Initial draw
drawWeb();

// Performance Chart
const chartCtx = document.getElementById('performanceChart').getContext('2d');
let performanceChart = new Chart(chartCtx, {
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

// Node Click Interaction with Zoom
document.querySelectorAll('.video-node').forEach(node => {
    node.addEventListener('click', () => {
        const videoId = node.getAttribute('data-id');
        const video = videoData[videoId];

        // Zoom Effect
        node.classList.add('zoom');
        setTimeout(() => {
            node.classList.remove('zoom');

            // Update Chart
            performanceChart.data.datasets[0].data = video.history;
            performanceChart.update();

            // Update Modal
            document.getElementById('modalTitle').textContent = video.title;
            document.getElementById('videoValue').textContent = `$${video.value}`;
            document.getElementById('videoChange').textContent = video.change;
            document.getElementById('modalVideo').src = `${video.videoUrl}?autoplay=1`;
            document.getElementById('performanceModal').style.display = 'flex';
        }, 400); // Matches zoom animation duration
    });

    // Video Preview on Hover
    node.addEventListener('mouseenter', () => {
        const iframe = node.querySelector('iframe');
        iframe.src = iframe.src + '&autoplay=1'; // Start video
    });

    node.addEventListener('mouseleave', () => {
        const iframe = node.querySelector('iframe');
        iframe.src = iframe.src.replace('&autoplay=1', ''); // Stop video
    });
});

// Modal Close
function closeModal() {
    document.getElementById('performanceModal').style.display = 'none';
    document.getElementById('modalVideo').src = ''; // Stop video
}