// Stock Chart
const ctx = document.getElementById('stockChart').getContext('2d');
const stockChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [{
            label: 'Video Value',
            data: [1.5, 1.8, 2.0, 2.3, 2.45],
            borderColor: '#ff4444',
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#fff' }
            },
            x: {
                ticks: { color: '#fff' }
            }
        },
        plugins: {
            legend: { labels: { color: '#fff' } }
        }
    }
});

// Invest Modal
function openInvestModal() {
    document.getElementById('investModal').style.display = 'block';
}

function closeInvestModal() {
    document.getElementById('investModal').style.display = 'none';
}

function updateInvestValue(value) {
    document.getElementById('investValue').textContent = value;
}

function confirmInvest() {
    const points = document.getElementById('investValue').textContent;
    alert(`Invested ${points} points in Sample Video!`);
    closeInvestModal();
}