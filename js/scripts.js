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

const htmlPractices = bestPractices.slice(0, 5);
const cssPractices = bestPractices.slice(5, 10);
const jsPractices = bestPractices.slice(10, 15);

// Initialize practices
document.addEventListener('DOMContentLoaded', function () {
    const practicesList = document.getElementById('practicesList');
    const summaryText = document.getElementById('summaryText');
    const rewardContainer = document.getElementById('rewardContainer');
    // Load user selections from localStorage
    const userSelections = JSON.parse(localStorage.getItem('userSelections')) || new Array(bestPractices.length).fill(false);
    // Initialize progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.setAttribute('aria-valuenow', '0');
    }
    // Load practices
    loadPractices();


    function updateSummary() {
        const count = userSelections.filter(selection => selection).length;
        const totalPractices = bestPractices.length;
        const progressPercentage = Math.round((count / totalPractices) * 100);
    
        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        const progressBarContainer = document.querySelector('.progress');
    
        if (!progressBar) {
            // Create progress bar if it doesn't exist
            const progressBarHtml = `
                <div class="progress" style="height: 20px; border-radius: 10px;">
                    <div class="progress-bar" role="progressbar" style="width: 0%" 
                         aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    </div>
                </div>
            `;
            const summaryCard = document.querySelector('.summary-card');
            summaryCard.innerHTML = summaryCard.innerHTML + progressBarHtml;
            progressBarContainer.innerHTML = progressBarHtml;
        }
    
        // Update progress bar width
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
    
        // Update summary message
        summaryText.className = '';
        let summaryMessage = `You've implemented ${count} out of ${totalPractices} best practices (${progressPercentage}%), reach 12 to get a reward!`;
    
        if (progressPercentage >= 80) {
            summaryText.className = 'success-message text-success';
            summaryMessage += ' 🎉';
        } else if (progressPercentage === 80) {
            summaryText.className = 'success-message text-success';
            summaryMessage += ' ✓';
        } else {
            summaryText.className = '';
        }
    
        summaryText.textContent = summaryMessage;
    
        if (progressPercentage >= 80) {
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
    

    function loadPractices() {
        const htmlContainer = document.getElementById('htmlPractices');
        const cssContainer = document.getElementById('cssPractices');
        const jsContainer = document.getElementById('jsPractices');

        function loadPracticesIntoContainer(practices, container, startIndex) {
            practices.forEach((practice, index) => {
                const practiceElement = document.createElement('div');
                practiceElement.className = 'practice-item';
                const originalIndex = startIndex + index;
                practiceElement.innerHTML = `
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="practice-${originalIndex}" ${userSelections[originalIndex] ? 'checked' : ''}>
                        <label class="form-check-label" for="practice-${originalIndex}">
                            <h4>${practice.title}</h4>
                            <p>${practice.explanation}</p>
                        </label>
                    </div>
                `;

                container.appendChild(practiceElement);

                const checkbox = practiceElement.querySelector('.form-check-input');
                checkbox.addEventListener('change', function () {
                    userSelections[originalIndex] = this.checked;
                    localStorage.setItem('userSelections', JSON.stringify(userSelections));
                    updateSummary();
                });
            });
        }

        loadPracticesIntoContainer(htmlPractices, htmlContainer, 0);
        loadPracticesIntoContainer(cssPractices, cssContainer, 5);
        loadPracticesIntoContainer(jsPractices, jsContainer, 10);

        updateSummary();
    }




    // Fetch random animal image (only pictures, no MP4 videos)
    async function fetchRandomAnimalImage() {
        try {
            let retries = 0;
            const maxRetries = 5; // Maximum number of retry attempts

            while (retries <= maxRetries) {
                const response = await fetch('https://random.dog/woof.json?width=400&height=300');
                const data = await response.json();

                // Check if the URL is an image (not MP4 video)
                if (isImageUrl(data.url)) {
                    return data.url;
                }

                // If it's a video, try again
                retries++;
                if (retries > maxRetries) {
                    throw new Error('Max retries exceeded - could not find an image URL');
                }
            }
        } catch (error) {
            console.error('Error fetching animal image:', error);
            return '';
        }
    }

    // Helper function to check if the URL is an image
    function isImageUrl(url) {
        // Check if the URL ends with an image file extension
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const lowerUrl = url.toLowerCase();
        return imageExtensions.some(ext => lowerUrl.endsWith(ext));
    }

});
