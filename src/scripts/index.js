document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.querySelector('.theme-label');
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.classList.add('active');
        themeLabel.textContent = 'Dark Mode';
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        // Toggle the active class on the slider
        themeToggle.classList.toggle('active');
        
        // Toggle dark theme class on body
        document.body.classList.toggle('dark-theme');
        
        // Determine current theme and update label
        const isDarkMode = document.body.classList.contains('dark-theme');
        themeLabel.textContent = isDarkMode ? 'Dark Mode' : 'Light Mode';
        
        // Save preference
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
});