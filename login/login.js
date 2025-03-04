console.log("Login/Signup script loaded");

function showTab(tabName) {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const buttons = document.querySelectorAll('.tab-button');

    if (tabName === 'login') {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }

    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.onclick.toString().includes(tabName));
    });
}

// Basic form submission handlers (for demonstration)
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    console.log("Login attempted with:", { username, password });
    alert(`Logging in as ${username}`);
    // Add your login logic here (e.g., API call)
    window.location.href = "index.html"; // Redirect to main page (replace with your actual page)
}

function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    console.log("Signup attempted with:", { username, email, password });
    alert(`Signed up as ${username}`);
    // Add your signup logic here (e.g., API call)
    window.location.href = "index.html"; // Redirect to main page (replace with your actual page)
}

// Set default tab to "Login"
showTab('login');