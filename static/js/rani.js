document.addEventListener('DOMContentLoaded', function () {
    const startDiagnosisBtn = document.getElementById('startDiagnosis');
    const modalOverlay = document.getElementById('modalOverlay');
    const initialOptions = document.getElementById('initialOptions');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signupFormContainer = document.getElementById('signupFormContainer');
    const guestOptionBtn = document.getElementById('guestOption');
    const loginSignupBtn = document.getElementById('loginSignup');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Show modal when Start Diagnosis button is clicked
    startDiagnosisBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
    });

    // Handle "Join as Guest" option
    guestOptionBtn.addEventListener('click', () => {
        alert('Welcome, Guest!');
        window.location.href = `/test?username=Guest`;
    });

    // Handle "Login/Signup" option
    loginSignupBtn.addEventListener('click', () => {
        initialOptions.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    // Show Signup form
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        signupFormContainer.style.display = 'block';
    });

    // Show Login form
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        if (username) {
            alert(`Welcome back, ${username}!`);
            window.location.href = `/test?username=${encodeURIComponent(username)}`;
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        if (username) {
            alert(`Welcome, ${username}! Your account has been created.`);
            window.location.href = `/test?username=${encodeURIComponent(username)}`;
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Close modal on outside click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    });
});