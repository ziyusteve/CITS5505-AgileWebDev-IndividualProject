// Best practices data
const bestPractices = [
    { id: 1, title: "Use Semantic Tags", explanation: "Always use semantic HTML5 tags (e.g., &lt;header&gt;, &lt;footer&gt;, &lt;article&gt;, &lt;section&gt;) for better structure and accessibility" },
    { id: 2, title: "Validate HTML", explanation: "Use tools like the W3C HTML Validator to ensure your code is error-free and standards-compliant" },
    { id: 3, title: "Close Tags Properly", explanation: "Ensure all tags are properly closed to maintain consistent rendering across browsers" },
    { id: 4, title: "Provide Alt Text for Images", explanation: "Add descriptive alt attributes to improve accessibility and SEO" },
    { id: 5, title: "Avoid Inline Styles", explanation: "Keep styling separate by using external CSS files" },
    { id: 6, title: "Organize Stylesheets", explanation: "Use CSS preprocessors like Sass or LESS for modular and maintainable code" },
    { id: 7, title: "Use Consistent Naming Conventions", explanation: "Adopt a consistent naming convention (e.g., BEM or camelCase) for classes and IDs" },
    { id: 8, title: "Minify CSS", explanation: "Remove unnecessary spaces and comments to reduce file size and improve load times" },
    { id: 9, title: "Implement Responsive Design", explanation: "Use media queries and flexible units (e.g., %, rem, vw) for adaptability across devices" },
    { id: 10, title: "Utilize CSS Variables", explanation: "Define variables for consistent theming and easier maintenance" },
    { id: 11, title: "Write Small, Focused Functions", explanation: "Break code into reusable, single-responsibility functions for better readability and maintainability" },
    { id: 12, title: "Use Async/Await for Asynchronous Operations", explanation: "Replace callbacks with async/await for cleaner and more readable code" },
    { id: 13, title: "Leverage Modern ES6 Features", explanation: "Use arrow functions, destructuring, and template literals for efficient coding" },
    { id: 14, title: "Implement Error Handling", explanation: "Use try/catch blocks to handle exceptions and prevent script crashes" },
    { id: 15, title: "Minimize Global Variables", explanation: "Keep variables scoped to functions or modules to reduce conflicts and improve security" }
];

// Initialize practices
document.addEventListener('DOMContentLoaded', function() {
    const practicesList = document.getElementById('practicesList');
    const summaryText = document.getElementById('summaryText');
    const rewardContainer = document.getElementById('rewardContainer');
    
    // Load user selections from localStorage
    const userSelections = JSON.parse(localStorage.getItem('userSelections')) || new Array(bestPractices.length).fill(false);
    
    // Load practices
    loadPractices();
    
    // Update summary
    function updateSummary() {
        const count = userSelections.filter(selection => selection).length;
        summaryText.textContent = `You've implemented ${count} out of ${bestPractices.length} best practices`;
        
        // Success criteria check
        if (count >= bestPractices.length * 0.8) { // Adjust threshold as needed
            if (!rewardContainer.querySelector('img')) {
                fetchRandomAnimalImage().then(url => {
                    const img = document.createElement('img');
                    img.src = url;
                    img.className = 'reward-image';
                    rewardContainer.appendChild(img);
                });
            }
        }
    }
    
    // Load practices into DOM
    function loadPractices() {
        bestPractices.forEach((practice, index) => {
            const practiceElement = document.createElement('div');
            practiceElement.className = 'practice-item';
            practiceElement.innerHTML = `
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="practice-${index}" ${userSelections[index] ? 'checked' : ''}>
                    <label class="form-check-label" for="practice-${index}">
                        <h4>${practice.title}</h4>
                        <p>${practice.explanation}</p>
                    </label>
                </div>
            `;
            
            practicesList.appendChild(practiceElement);
            
            // Add event listener for checkbox changes
            const checkbox = practiceElement.querySelector('.form-check-input');
            checkbox.addEventListener('change', function() {
                userSelections[index] = this.checked;
                localStorage.setItem('userSelections', JSON.stringify(userSelections));
                updateSummary();
            });
        });
        
        updateSummary();
    }
    
    // Fetch random animal image
    async function fetchRandomAnimalImage() {
        try {
            const response = await fetch('https://random.dog/woof.json');
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Error fetching animal image:', error);
            return '';
        }
    }
});
