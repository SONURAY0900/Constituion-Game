// Page navigation elements
        const pages = {
            login: document.getElementById('loginPage'),
            forgotPassword: document.getElementById('forgotPasswordPage'),
            mockLogin: document.getElementById('mockLoginPage'),
            survey: document.getElementById('surveyPage'),
            character: document.getElementById('characterPage'),
            game: document.getElementById('gamePage'),
            map: document.getElementById('mapPage'),
            quiz: document.getElementById('quizPage'),
            timeline: document.getElementById('timelinePage'),
            leaders: document.getElementById('leadersPage'),
            articles: document.getElementById('articlesPage'),
            amendments: document.getElementById('amendmentsPage'),
            preamble: document.getElementById('preambleGamePage'),
            rights: document.getElementById('rightsDutiesPage')
        };
        
        const mockLoginTitle = document.getElementById('mockLoginTitle');
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const playerNameDisplay = document.getElementById('playerNameDisplay');
        const characterAvatar = document.getElementById('characterAvatar');
        const character = document.getElementById('character');
        const badgesContainer = document.getElementById('badgesContainer');
        const badgeCount = document.getElementById('badgeCount');
        
        // Modal elements
        const constitutionModal = document.getElementById('constitutionModal');
        const closeModal = document.querySelector('.close-modal');
        
        // Game state variables
        let gameProgress = 0;
        let currentCharacter = '';
        let playerNickname = 'Constitutional Scholar';
        let currentQuestionIndex = 0;
        let score = 0;
        let map;
        let earnedBadges = [];
        
        // Character images
        const characterImages = {
            ambedkar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/800px-Dr._Bhimrao_Ambedkar.jpg',
            nehru: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Jawaharlal_Nehru_1947.jpg/800px-Jawaharlal_Nehru_1947.jpg',
            patel: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Sardar_patel_%28cropped%29.jpg/800px-Sardar_patel_%28cropped%29.jpg'
        };
        
        // Badge definitions
        const badges = [
            { id: 'map', name: 'Explorer', description: 'Completed Map Explorer' },
            { id: 'quiz', name: 'Scholar', description: 'Scored 80%+ in Quiz' },
            { id: 'timeline', name: 'Historian', description: 'Completed Timeline' },
            { id: 'leaders', name: 'Biographer', description: 'Learned about all Leaders' },
            { id: 'articles', name: 'Jurist', description: 'Studied all Articles' },
            { id: 'amendments', name: 'Reformer', description: 'Learned all Amendments' },
            { id: 'preamble', name: 'Patriot', description: 'Completed Preamble Puzzle' },
            { id: 'rights', name: 'Citizen', description: 'Matched all Rights & Duties' }
        ];
        
        // Database simulation - in a real app, this would connect to Oracle DB
        const dbSimulation = {
            userTable: [],
            saveUser: function(username, password) {
                this.userTable.push({username, password, progress: 0, badges: []});
                console.log('User saved to DB:', username);
                return true;
            },
            verifyUser: function(username, password) {
                const user = this.userTable.find(u => u.username === username && u.password === password);
                return !!user;
            },
            saveProgress: function(username, progress, badges) {
                const user = this.userTable.find(u => u.username === username);
                if (user) {
                    user.progress = progress;
                    user.badges = badges;
                    console.log('Progress saved for user:', username, progress, badges);
                    return true;
                }
                return false;
            },
            getProgress: function(username) {
                const user = this.userTable.find(u => u.username === username);
                return user ? {progress: user.progress, badges: user.badges || []} : {progress: 0, badges: []};
            }
        };
        
        // Function to show a specific page and hide others
        function showPage(page) {
            Object.values(pages).forEach(p => p.style.display = 'none');
            page.style.display = 'block';
            
            // Update player name display when showing game page
            if (page === pages.game) {
                playerNameDisplay.textContent = playerNickname;
            }
        }
        
        // Login form handler
        document.getElementById('loginForm').onsubmit = function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username && password) {
                // For demo purposes, we'll create a user if it doesn't exist
                if (!dbSimulation.verifyUser(username, password)) {
                    dbSimulation.saveUser(username, password);
                }
                
                // Load user progress
                const userData = dbSimulation.getProgress(username);
                gameProgress = userData.progress;
                earnedBadges = userData.badges || [];
                updateProgress();
                updateBadges();
                
                showPage(pages.survey);
            } else {
                alert('Please enter both username and password');
            }
        };
        
        // Google login handler
        document.getElementById('googleLoginBtn').onclick = function() {
            showMockLogin('Google');
        };
        
        // Facebook login handler
        document.getElementById('facebookLoginBtn').onclick = function() {
            showMockLogin('Facebook');
        };
        
        // Show mock login page
        function showMockLogin(service) {
            mockLoginTitle.textContent = `${service} Login`;
            showPage(pages.mockLogin);
        }
        
        // Mock login form handler
        document.getElementById('mockLoginForm').onsubmit = function(e) {
            e.preventDefault();
            showPage(pages.survey);
        };
        
        // Forgot password link handler
        document.getElementById('forgotPasswordLink').onclick = function(e) {
            e.preventDefault();
            showPage(pages.forgotPassword);
        };
        
        // Forgot password form handler
        document.getElementById('forgotPasswordForm').onsubmit = function(e) {
            e.preventDefault();
            alert("Password reset link sent to your email!");
            showPage(pages.login);
        };
        
        // Back to login button handler
        document.getElementById('backToLoginBtn').onclick = function() {
            showPage(pages.login);
        };
        
        // Survey form handler
        document.getElementById('surveyForm').onsubmit = function(e) {
            e.preventDefault();
            showPage(pages.character);
        };
        
        // Character selection handler
        document.querySelectorAll('.character-select').forEach(button => {
            button.addEventListener('click', function() {
                currentCharacter = this.getAttribute('data-character');
                console.log(`Selected character: ${currentCharacter}`);
                
                // Update avatar image based on selected character
                characterAvatar.src = characterImages[currentCharacter];
                character.style.backgroundImage = `url('${characterImages[currentCharacter]}')`;
            });
        });
        
        // Nickname confirmation handler
        document.getElementById('confirmNickname').addEventListener('click', function() {
            playerNickname = document.getElementById('nicknameInput').value || 'Constitutional Scholar';
            showPage(pages.game);
        });
        
        // Game navigation handlers
        document.querySelectorAll('.play-btn').forEach(button => {
            button.addEventListener('click', function() {
                const mode = this.getAttribute('data-mode');
                console.log(`Playing ${mode} mode`);
                
                switch(mode) {
                    case 'map':
                        showPage(pages.map);
                        initMap();
                        break;
                    case 'quiz':
                        showPage(pages.quiz);
                        loadQuiz();
                        break;
                    case 'timeline':
                        showPage(pages.timeline);
                        loadTimeline();
                        break;
                    case 'leaders':
                        showPage(pages.leaders);
                        loadLeaders();
                        break;
                    case 'articles':
                        showPage(pages.articles);
                        loadArticles();
                        break;
                    case 'amendments':
                        showPage(pages.amendments);
                        loadAmendments();
                        break;
                    case 'preamble':
                        showPage(pages.preamble);
                        loadPreambleGame();
                        break;
                    case 'rights':
                        showPage(pages.rights);
                        loadRightsDuties();
                        break;
                    default:
                        alert(`${mode.charAt(0).toUpperCase() + mode.slice(1)} mode is under development`);
                }
                
                // Add a small progress increment for trying a game mode
                if (gameProgress < 100) {
                    gameProgress += 2;
                    updateProgress();
                }
            });
        });
        
        // Back to game menu button handlers
        document.getElementById('backToGameBtn').addEventListener('click', function() {
            showPage(pages.game);
        });
        
        document.getElementById('backToGameFromQuiz').addEventListener('click', function() {
            showPage(pages.game);
        });
        
        document.getElementById('backToGameFromTimeline').addEventListener('click', function() {
            showPage(pages.game);
        });
        
        document.getElementById('backToGameFromLeaders').addEventListener('click', function() {
            showPage(pages.game);
        });
        
        document.getElementById('backToGameFromArticles').addEventListener('click', function() {
            showPage(pages.game);
        });
        
        document.getElementById('backToGameFromAmendments').addEventListener('click', function() {
            showPage(pages.game);
        });
        
        document.getElementById('backToGameFromPreamble').addEventListener('click', function() {
            showPage(pages.game);
        });
        
        document.getElementById('backToGameFromRights').addEventListener('click', function() {
            showPage(pages.game);
        });
        
        // Settings button handler
        document.querySelector('.settings-btn').addEventListener('click', function() {
            alert('Settings panel is under development');
        });
        
        // Constitution book handler
        document.getElementById('constitutionBook').addEventListener('click', function() {
            constitutionModal.style.display = 'block';
        });
        
        // Close modal handler
        closeModal.addEventListener('click', function() {
            constitutionModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === constitutionModal) {
                constitutionModal.style.display = 'none';
            }
        });
        
        // Update progress bar and save progress
        function updateProgress() {
            if (gameProgress > 100) gameProgress = 100;
            progressBar.style.width = `${gameProgress}%`;
            progressPercent.textContent = `${Math.round(gameProgress)}%`;
            
            // Save progress to database
            const username = document.getElementById('username').value;
            if (username) {
                dbSimulation.saveProgress(username, gameProgress, earnedBadges);
            }
            
            // Check if game is completed
            if (gameProgress >= 100) {
                setTimeout(() => {
                    alert('Congratulations! You have completed the Constitution of India Game!');
                }, 500);
            }
        }
        
        // Update badges display
        function updateBadges() {
            badgesContainer.innerHTML = '';
            let earnedCount = 0;
            
            badges.forEach(badge => {
                const hasBadge = earnedBadges.includes(badge.id);
                if (hasBadge) earnedCount++;
                
                const badgeElement = document.createElement('div');
                badgeElement.className = `badge ${hasBadge ? 'earned' : ''}`;
                badgeElement.title = `${badge.name}: ${badge.description}`;
                badgeElement.innerHTML = hasBadge ? `
                    <div>${badge.name}</div>
                    <i class="fas fa-check"></i>
                ` : `
                    <div>?</div>
                `;
                
                badgesContainer.appendChild(badgeElement);
            });
            
            badgeCount.textContent = `${earnedCount}/${badges.length}`;
        }
        
        // Award a badge if not already earned
        function awardBadge(badgeId) {
            if (!earnedBadges.includes(badgeId)) {
                earnedBadges.push(badgeId);
                updateBadges();
                
                const badge = badges.find(b => b.id === badgeId);
                if (badge) {
                    alert(`Congratulations! You earned the "${badge.name}" badge!\n${badge.description}`);
                }
                
                // Save progress with new badge
                const username = document.getElementById('username').value;
                if (username) {
                    dbSimulation.saveProgress(username, gameProgress, earnedBadges);
                }
                
                return true;
            }
            return false;
        }
        
        // Initialize the map
        function initMap() {
            if (map) {
                map.remove();
            }
            
            // Create map centered on India
            map = L.map('map').setView([23.5937, 78.9629], 5);
            
            // Add OSM tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Add state markers
            addStateMarkers();
        }
        
        // Add state markers to the map
        function addStateMarkers() {
            // This would ideally come from the database
            const states = [
                { name: "Delhi", lat: 28.7041, lng: 77.1025, fact: "Delhi is where the Constitutional Assembly met.", article: "Article 239AA" },
                { name: "Maharashtra", lat: 19.7515, lng: 75.7139, fact: "Maharashtra was formed on May 1, 1960.", article: "State Reorganization Act" },
                { name: "Tamil Nadu", lat: 11.1271, lng: 78.6569, fact: "First state to implement reservation policy.", article: "Article 15 & 16" },
                { name: "Kerala", lat: 10.8505, lng: 76.2711, fact: "First state to elect a communist government democratically.", article: "Article 164" },
                { name: "Gujarat", lat: 22.2587, lng: 71.1924, fact: "Birthplace of Mahatma Gandhi.", article: "Preamble" },
                { name: "West Bengal", lat: 22.9868, lng: 87.8550, fact: "Home to Calcutta High Court, oldest High Court in India.", article: "Article 214" },
                { name: "Punjab", lat: 31.1471, lng: 75.3412, fact: "Significant in the formation of India-Pakistan border.", article: "Article 1" },
                { name: "Bihar", lat: 25.0961, lng: 85.3131, fact: "Champaran Satyagraha was launched here by Gandhi.", article: "Article 19" },
                { name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, fact: "Sends the most members to Parliament.", article: "Article 81" },
                { name: "Rajasthan", lat: 27.0238, lng: 74.2179, fact: "Largest state by area in India.", article: "Article 3" }
            ];
            
            let statesVisited = 0;
            
            states.forEach(state => {
                const marker = L.marker([state.lat, state.lng], {
                    icon: L.divIcon({
                        className: 'state-marker',
                        iconSize: [14, 14]
                    })
                }).addTo(map);
                
                const popupContent = `
                    <div class="popup-content">
                        <div class="popup-title">${state.name}</div>
                        <div class="popup-info">${state.fact}</div>
                        <div class="popup-info">Related: ${state.article}</div>
                        <button class="popup-button" onclick="alert('Starting constitutional challenge for ${state.name}!')">Challenge</button>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                
                // Add click handler to update progress
                marker.on('click', function() {
                    statesVisited++;
                    gameProgress += 2;
                    updateProgress();
                    
                    if (statesVisited >= 5 && !earnedBadges.includes('map')) {
                        awardBadge('map');
                    }
                });
            });
        }
        
        // Quiz functionality
        const quizQuestions = [
            {
                question: "When was the Constitution of India adopted?",
                options: ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1948"],
                answer: 2,
                explanation: "The Constitution was adopted by the Constituent Assembly on 26 November 1949 and came into effect on 26 January 1950."
            },
            {
                question: "Who was the Chairman of the Drafting Committee of the Indian Constitution?",
                options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Dr. B.R. Ambedkar", "Sardar Vallabhbhai Patel"],
                answer: 2,
                explanation: "Dr. B.R. Ambedkar is recognized as the 'Father of the Indian Constitution' for his role as Chairman of the Drafting Committee."
            },
            {
                question: "Which Article of the Indian Constitution abolishes untouchability?",
                options: ["Article 14", "Article 15", "Article 17", "Article 21"],
                answer: 2,
                explanation: "Article 17 abolishes untouchability and forbids its practice in any form."
            },
            {
                question: "The Indian Constitution recognizes ___ languages in the 8th Schedule.",
                options: ["18", "22", "24", "28"],
                answer: 1,
                explanation: "Originally 14 languages were included, now there are 22 officially recognized languages in the 8th Schedule."
            },
            {
                question: "Which part of the Indian Constitution contains Fundamental Rights?",
                options: ["Part II", "Part III", "Part IV", "Part V"],
                answer: 1,
                explanation: "Part III (Articles 12-35) contains the Fundamental Rights guaranteed to all citizens."
            },
            {
                question: "Which Article provides for the Right to Education?",
                options: ["Article 21", "Article 21A", "Article 45", "Article 51A"],
                answer: 1,
                explanation: "Article 21A, added by the 86th Amendment in 2002, makes education a fundamental right for children aged 6-14."
            },
            {
                question: "The idea of Fundamental Duties in the Indian Constitution was borrowed from which country?",
                options: ["USA", "UK", "USSR", "Japan"],
                answer: 2,
                explanation: "The Fundamental Duties (Article 51A) were inspired by the Constitution of the former USSR."
            },
            {
                question: "Which Constitutional Amendment introduced the Anti-Defection Law?",
                options: ["42nd Amendment", "44th Amendment", "52nd Amendment", "73rd Amendment"],
                answer: 2,
                explanation: "The 52nd Amendment Act of 1985 added the Tenth Schedule which contains the anti-defection provisions."
            },
            {
                question: "Which Article defines India as a 'Union of States'?",
                options: ["Article 1", "Article 2", "Article 3", "Article 4"],
                answer: 0,
                explanation: "Article 1 declares that India shall be a Union of States, emphasizing the indestructible nature of the Union."
            },
            {
                question: "Who was the first woman judge of the Supreme Court of India?",
                options: ["Ruma Pal", "Leila Seth", "Fathima Beevi", "Indira Banerjee"],
                answer: 2,
                explanation: "Justice M. Fathima Beevi was appointed as the first woman judge of the Supreme Court in 1989."
            }
        ];
        
        // Load quiz questions
        function loadQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            displayQuestion();
        }
        
        // Display current question
        function displayQuestion() {
            const questionElem = document.getElementById('question');
            const optionsElem = document.getElementById('options');
            const currentQuestion = quizQuestions[currentQuestionIndex];
            
            questionElem.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
            optionsElem.innerHTML = '';
            
            currentQuestion.options.forEach((option, index) => {
                const optionElem = document.createElement('div');
                optionElem.className = 'quiz-option';
                optionElem.textContent = option;
                optionElem.dataset.index = index;
                
                optionElem.addEventListener('click', function() {
                    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
                
                optionsElem.appendChild(optionElem);
            });
        }
        
        // Submit answer handler
        document.getElementById('submitAnswer').addEventListener('click', function() {
            const selectedOption = document.querySelector('.quiz-option.selected');
            
            if (!selectedOption) {
                alert('Please select an answer');
                return;
            }
            
            const selectedAnswer = parseInt(selectedOption.dataset.index);
            const correctAnswer = quizQuestions[currentQuestionIndex].answer;
            const explanation = quizQuestions[currentQuestionIndex].explanation;
            
            if (selectedAnswer === correctAnswer) {
                score++;
                alert(`Correct!\n\n${explanation}`);
            } else {
                alert(`Incorrect. The correct answer is: ${quizQuestions[currentQuestionIndex].options[correctAnswer]}\n\n${explanation}`);
            }
            
            currentQuestionIndex++;
            
            if (currentQuestionIndex < quizQuestions.length) {
                displayQuestion();
            } else {
                const percentage = Math.round((score / quizQuestions.length) * 100);
                const performanceMsg = getPerformanceMessage(percentage);
                alert(`Quiz completed!\nYour score: ${score}/${quizQuestions.length} (${percentage}%)\n\n${performanceMsg}`);
                
                // Add progress based on percentage score
                gameProgress += percentage / 5;
                updateProgress();
                
                // Award badge if score is 80% or higher
                if (percentage >= 80) {
                    awardBadge('quiz');
                }
                
                showPage(pages.game);
            }
        });
        
        // Get performance message based on quiz score
        function getPerformanceMessage(percentage) {
            if (percentage >= 90) return "Outstanding! You're a Constitution expert!";
            if (percentage >= 70) return "Great job! You know the Constitution well.";
            if (percentage >= 50) return "Good effort! Keep learning about our Constitution.";
            return "Keep practicing! The Constitution is worth understanding.";
        }
        
        // Timeline Game
        function loadTimeline() {
            const timelineContainer = document.getElementById('timeline');
            timelineContainer.innerHTML = '';
            
            const timelineEvents = [
                {
                    date: "December 1946",
                    title: "First Meeting of Constituent Assembly",
                    description: "The Constituent Assembly met for the first time in New Delhi, with Dr. Sachchidananda Sinha as the temporary chairman."
                },
                {
                    date: "December 1946",
                    title: "Objectives Resolution",
                    description: "Jawaharlal Nehru moved the historic 'Objectives Resolution' which outlined the ideals of the Constitution."
                },
                {
                    date: "August 1947",
                    title: "Drafting Committee Formed",
                    description: "The Drafting Committee was appointed with Dr. B.R. Ambedkar as the Chairman."
                },
                {
                    date: "November 1948",
                    title: "First Draft Presented",
                    description: "Dr. Ambedkar presented the first draft of the Constitution to the Assembly."
                },
                {
                    date: "November 1949",
                    title: "Constitution Adopted",
                    description: "The Constitution was adopted by the Constituent Assembly on 26th November."
                },
                {
                    date: "January 1950",
                    title: "Constitution Came into Effect",
                    description: "The Constitution of India came into force on 26th January, marking India's transition to a republic."
                }
            ];
            
            timelineEvents.forEach((event, index) => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.innerHTML = `
                    <div class="timeline-content">
                        <div class="timeline-date">${event.date}</div>
                        <h3>${event.title}</h3>
                        <p>${event.description}</p>
                    </div>
                `;
                
                timelineContainer.appendChild(timelineItem);
                
                // Animate timeline items one by one
                setTimeout(() => {
                    timelineItem.classList.add('visible');
                    
                    // Add progress when viewing timeline items
                    if (index % 2 === 0) {
                        gameProgress += 3;
                        updateProgress();
                    }
                    
                    // Award badge when reaching the end
                    if (index === timelineEvents.length - 1) {
                        awardBadge('timeline');
                    }
                }, index * 300);
            });
        }
        
        // Leaders Game
        function loadLeaders() {
            const leadersContainer = document.getElementById('leadersContainer');
            leadersContainer.innerHTML = '';
            
            const leaders = [
                {
                    name: "Dr. B.R. Ambedkar",
                    role: "Chairman, Drafting Committee",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/800px-Dr._Bhimrao_Ambedkar.jpg",
                    fact: "Known as the Father of the Indian Constitution, he was the principal architect of the document."
                },
                {
                    name: "Jawaharlal Nehru",
                    role: "First Prime Minister of India",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Jawaharlal_Nehru_1947.jpg/800px-Jawaharlal_Nehru_1947.jpg",
                    fact: "Moved the Objectives Resolution which outlined the fundamental principles of the Constitution."
                },
                {
                    name: "Sardar Vallabhbhai Patel",
                    role: "First Deputy Prime Minister",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Sardar_patel_%28cropped%29.jpg/800px-Sardar_patel_%28cropped%29.jpg",
                    fact: "Played a key role in integrating princely states into the Indian Union."
                },
                {
                    name: "Rajendra Prasad",
                    role: "President of Constituent Assembly",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Rajendra_Prasad.jpg/800px-Rajendra_Prasad.jpg",
                    fact: "Elected as the permanent Chairman of the Constituent Assembly and later became India's first President."
                },
                {
                    name: "B.N. Rau",
                    role: "Constitutional Advisor",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Benegal_Narsing_Rau.jpg/800px-Benegal_Narsing_Rau.jpg",
                    fact: "Prepared the initial draft of the Constitution which was debated and revised by the Assembly."
                },
                {
                    name: "K.M. Munshi",
                    role: "Member, Drafting Committee",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Kanhaiyalal_Maneklal_Munshi.jpg/800px-Kanhaiyalal_Maneklal_Munshi.jpg",
                    fact: "Played a significant role in drafting the Constitution and later served as India's High Commissioner to Pakistan."
                }
            ];
            
            let leadersViewed = 0;
            
            leaders.forEach(leader => {
                const leaderCard = document.createElement('div');
                leaderCard.className = 'leader-card';
                leaderCard.innerHTML = `
                    <img src="${leader.image}" alt="${leader.name}" class="leader-image">
                    <div class="leader-info">
                        <h3>${leader.name}</h3>
                        <p>${leader.role}</p>
                    </div>
                `;
                
                leaderCard.addEventListener('click', function() {
                    alert(`${leader.name}\n${leader.role}\n\n${leader.fact}`);
                    
                    leadersViewed++;
                    gameProgress += 2;
                    updateProgress();
                    
                    if (leadersViewed >= leaders.length && !earnedBadges.includes('leaders')) {
                        awardBadge('leaders');
                    }
                });
                
                leadersContainer.appendChild(leaderCard);
            });
        }
        
        // Articles Game
        function loadArticles() {
            const articlesGrid = document.getElementById('articlesGrid');
            articlesGrid.innerHTML = '';
            
            const articles = [
                { number: "14", title: "Equality before law" },
                { number: "15", title: "Prohibition of discrimination" },
                { number: "16", title: "Equality of opportunity" },
                { number: "17", title: "Abolition of untouchability" },
                { number: "19", title: "Freedom of speech" },
                { number: "21", title: "Protection of life" },
                { number: "21A", title: "Right to education" },
                { number: "32", title: "Right to constitutional remedies" },
                { number: "44", title: "Uniform civil code" },
                { number: "51A", title: "Fundamental duties" },
                { number: "72", title: "Pardoning powers of President" },
                { number: "74", title: "Council of Ministers" }
            ];
            
            let articlesViewed = 0;
            
            articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'article-card';
                articleCard.innerHTML = `
                    <div class="article-number">${article.number}</div>
                    <div class="article-title">${article.title}</div>
                `;
                
                articleCard.addEventListener('click', function() {
                    alert(`Article ${article.number}\n${article.title}`);
                    
                    articlesViewed++;
                    gameProgress += 1;
                    updateProgress();
                    
                    if (articlesViewed >= articles.length && !earnedBadges.includes('articles')) {
                        awardBadge('articles');
                    }
                });
                
                articlesGrid.appendChild(articleCard);
            });
        }
        
        // Amendments Game
        function loadAmendments() {
            const amendmentsContainer = document.getElementById('amendmentsContainer');
            amendmentsContainer.innerHTML = '';
            
            const amendments = [
                {
                    number: "1st",
                    year: "1951",
                    title: "Added Ninth Schedule",
                    description: "Protected land reform laws from judicial review."
                },
                {
                    number: "7th",
                    year: "1956",
                    title: "Reorganization of States",
                    description: "Reorganized states on linguistic basis and introduced Union Territories."
                },
                {
                    number: "42nd",
                    year: "1976",
                    title: "Fundamental Duties Added",
                    description: "Added Fundamental Duties and made several other changes during Emergency."
                },
                {
                    number: "44th",
                    year: "1978",
                    title: "Right to Property Removed",
                    description: "Removed Right to Property from Fundamental Rights and made it a legal right."
                },
                {
                    number: "52nd",
                    year: "1985",
                    title: "Anti-Defection Law",
                    description: "Added Tenth Schedule regarding disqualification of defecting members."
                },
                {
                    number: "73rd",
                    year: "1992",
                    title: "Panchayati Raj",
                    description: "Constitutional status to Panchayati Raj institutions."
                },
                {
                    number: "74th",
                    year: "1992",
                    title: "Municipalities",
                    description: "Constitutional status to Urban Local Bodies."
                },
                {
                    number: "86th",
                    year: "2002",
                    title: "Right to Education",
                    description: "Made elementary education a fundamental right."
                },
                {
                    number: "101st",
                    year: "2016",
                    title: "GST",
                    description: "Introduced Goods and Services Tax."
                }
            ];
            
            let amendmentsViewed = 0;
            
            amendments.forEach(amendment => {
                const amendmentCard = document.createElement('div');
                amendmentCard.className = 'amendment-card';
                amendmentCard.innerHTML = `
                    <div class="amendment-header">
                        <span class="amendment-number">${amendment.number} Amendment</span>
                        <span class="amendment-year">${amendment.year}</span>
                    </div>
                    <div class="amendment-title">${amendment.title}</div>
                    <div class="amendment-description">${amendment.description}</div>
                `;
                
                amendmentCard.addEventListener('click', function() {
                    amendmentsViewed++;
                    gameProgress += 1;
                    updateProgress();
                    
                    if (amendmentsViewed >= amendments.length && !earnedBadges.includes('amendments')) {
                        awardBadge('amendments');
                    }
                });
                
                amendmentsContainer.appendChild(amendmentCard);
            });
        }
        
        // Preamble Puzzle Game
        function loadPreambleGame() {
            const preambleText = document.getElementById('preambleText');
            const preambleBlanks = document.getElementById('preambleBlanks');
            const preamblePuzzle = document.getElementById('preamblePuzzle');
            
            const preambleParts = [
                "WE, THE PEOPLE OF INDIA,",
                "having solemnly resolved to constitute India into a",
                "SOVEREIGN",
                "SOCIALIST",
                "SECULAR",
                "DEMOCRATIC",
                "REPUBLIC",
                "and to secure to all its citizens:",
                "JUSTICE, social, economic and political;",
                "LIBERTY of thought, expression, belief, faith and worship;",
                "EQUALITY of status and of opportunity;",
                "and to promote among them all",
                "FRATERNITY assuring the dignity of the individual",
                "and the unity and integrity of the Nation;",
                "IN OUR CONSTITUENT ASSEMBLY",
                "this twenty-sixth day of November, 1949,",
                "do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION."
            ];
            
            // Display full preamble
            preambleText.innerHTML = preambleParts.join('<br>');
            
            // Create blank options (shuffled)
            const blankWords = ["SOVEREIGN", "SOCIALIST", "SECULAR", "DEMOCRATIC", "REPUBLIC", 
                              "JUSTICE", "LIBERTY", "EQUALITY", "FRATERNITY"];
            
            // Shuffle array
            const shuffledWords = [...blankWords].sort(() => Math.random() - 0.5);
            
            preambleBlanks.innerHTML = '';
            shuffledWords.forEach(word => {
                const option = document.createElement('div');
                option.className = 'blank-option';
                option.textContent = word;
                option.dataset.word = word;
                
                option.addEventListener('click', function() {
                    // Find first empty blank space and fill it
                    const blankSpaces = document.querySelectorAll('.blank-space:not(.filled)');
                    if (blankSpaces.length > 0) {
                        blankSpaces[0].textContent = word;
                        blankSpaces[0].classList.add('filled');
                        blankSpaces[0].dataset.word = word;
                        this.style.visibility = 'hidden';
                    }
                });
                
                preambleBlanks.appendChild(option);
            });
            
            // Create puzzle with blanks
            const puzzleParts = preambleParts.map(part => {
                // Check if this part contains any of our blank words
                for (const word of blankWords) {
                    if (part.includes(word)) {
                        return part.replace(word, `<span class="blank-space" data-correct="${word}"></span>`);
                    }
                }
                return part;
            });
            
            preamblePuzzle.innerHTML = puzzleParts.join('<br>');
        }
        
        // Check Preamble Puzzle
        document.getElementById('checkPreamble').addEventListener('click', function() {
            const blankSpaces = document.querySelectorAll('.blank-space');
            let correct = 0;
            
            blankSpaces.forEach(space => {
                if (space.textContent === space.dataset.correct) {
                    correct++;
                    space.style.color = 'green';
                } else {
                    space.style.color = 'red';
                }
            });
            
            const percentage = Math.round((correct / blankSpaces.length) * 100);
            
            if (percentage === 100) {
                alert('Perfect! You correctly reconstructed the Preamble!');
                gameProgress += 15;
                awardBadge('preamble');
            } else {
                alert(`You got ${correct} out of ${blankSpaces.length} correct (${percentage}%). Try again!`);
                gameProgress += percentage / 2;
            }
            
            updateProgress();
        });
        
        // Rights & Duties Game
        function loadRightsDuties() {
            const rightsList = document.getElementById('rightsList');
            const dutiesList = document.getElementById('dutiesList');
            
            const rights = [
                "Right to Equality (Articles 14-18)",
                "Right to Freedom (Articles 19-22)",
                "Right against Exploitation (Articles 23-24)",
                "Right to Freedom of Religion (Articles 25-28)",
                "Cultural and Educational Rights (Articles 29-30)",
                "Right to Constitutional Remedies (Article 32)"
            ];
            
            const duties = [
                "To abide by the Constitution and respect its ideals (Article 51A(a))",
                "To cherish and follow the noble ideals of freedom struggle (51A(b))",
                "To uphold and protect sovereignty, unity and integrity (51A(c))",
                "To defend the country and render national service (51A(d))",
                "To promote harmony and spirit of common brotherhood (51A(e))",
                "To value and preserve rich heritage (51A(f))"
            ];
            
            // Shuffle both arrays
            const shuffledRights = [...rights].sort(() => Math.random() - 0.5);
            const shuffledDuties = [...duties].sort(() => Math.random() - 0.5);
            
            rightsList.innerHTML = '';
            dutiesList.innerHTML = '';
            
            shuffledRights.forEach((right, index) => {
                const li = document.createElement('li');
                li.className = 'rights-duties-item rights-item';
                li.textContent = right;
                li.dataset.index = index;
                rightsList.appendChild(li);
            });
            
            shuffledDuties.forEach((duty, index) => {
                const li = document.createElement('li');
                li.className = 'rights-duties-item duties-item';
                li.textContent = duty;
                li.dataset.index = index;
                dutiesList.appendChild(li);
            });
            
            // Add selection functionality
            let selectedRight = null;
            let selectedDuty = null;
            
            document.querySelectorAll('.rights-item').forEach(item => {
                item.addEventListener('click', function() {
                    document.querySelectorAll('.rights-item').forEach(i => i.style.backgroundColor = '');
                    this.style.backgroundColor = '#FFE0B2';
                    selectedRight = this.dataset.index;
                });
            });
            
            document.querySelectorAll('.duties-item').forEach(item => {
                item.addEventListener('click', function() {
                    document.querySelectorAll('.duties-item').forEach(i => i.style.backgroundColor = '');
                    this.style.backgroundColor = '#C8E6C9';
                    selectedDuty = this.dataset.index;
                });
            });
        }
        
        // Check Rights & Duties Matches
        document.getElementById('checkRightsDuties').addEventListener('click', function() {
            const rightsItems = document.querySelectorAll('.rights-item');
            const dutiesItems = document.querySelectorAll('.duties-item');
            
            // In a real game, you would have a proper matching system
            // For demo, we'll just check if they selected one of each
            if (rightsItems.length === dutiesItems.length) {
                let correctMatches = 0;
                
                // Simple matching - position based (in real app, would need proper mapping)
                rightsItems.forEach((item, index) => {
                    if (item.style.backgroundColor && dutiesItems[index].style.backgroundColor) {
                        correctMatches++;
                        item.style.backgroundColor = '#C8E6C9';
                        dutiesItems[index].style.backgroundColor = '#C8E6C9';
                    }
                });
                
                const percentage = Math.round((correctMatches / rightsItems.length) * 100);
                alert(`You matched ${correctMatches} out of ${rightsItems.length} (${percentage}%)`);
                
                gameProgress += percentage / 2;
                updateProgress();
                
                if (percentage >= 80) {
                    awardBadge('rights');
                }
            }
        });
        
        // Initialize the game
        function initGame() {
            showPage(pages.login);
            updateBadges();
        }
        
        // Start the game
        initGame();