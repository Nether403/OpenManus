/**
 * Manages the chat interface and user interactions
 */
export class ChatInterface {
    constructor(agentSimulator) {
        this.agentSimulator = agentSimulator;
        this.isProcessing = false;
    }

    init() {
        this.setupEventListeners();
        this.setupExamplePrompts();
    }

    setupEventListeners() {
        const sendBtn = document.getElementById('sendBtn');
        const userInput = document.getElementById('userInput');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (userInput) {
            // Auto-resize textarea
            userInput.addEventListener('input', this.autoResizeTextarea);
            
            // Enter key handling
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    setupExamplePrompts() {
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.target.getAttribute('data-prompt');
                if (prompt) {
                    const userInput = document.getElementById('userInput');
                    if (userInput) {
                        userInput.value = prompt;
                        userInput.focus();
                        this.autoResizeTextarea.call(userInput);
                    }
                }
            });
        });
    }

    autoResizeTextarea() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    }

    async sendMessage() {
        if (this.isProcessing) return;

        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');
        
        if (!userInput || !userInput.value.trim()) return;

        const message = userInput.value.trim();
        
        // Clear input and reset height
        userInput.value = '';
        userInput.style.height = 'auto';

        // Update UI state
        this.setProcessingState(true, sendBtn);

        // Add user message to chat
        this.addMessage('user', message);

        try {
            // Simulate agent processing
            await this.agentSimulator.processMessage(message, (response) => {
                this.addMessage('agent', response);
            });
        } catch (error) {
            this.addMessage('agent', `Error: ${error.message}`);
            console.error('Agent processing error:', error);
        } finally {
            this.setProcessingState(false, sendBtn);
            userInput.focus();
        }
    }

    addMessage(role, content) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        // Format content based on role
        if (role === 'user') {
            contentDiv.innerHTML = `<strong>You:</strong> ${this.escapeHtml(content)}`;
        } else if (role === 'agent') {
            contentDiv.innerHTML = `<strong>Agent:</strong> ${this.formatAgentResponse(content)}`;
        }

        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatAgentResponse(content) {
        // Basic markdown-like formatting for agent responses
        let formatted = this.escapeHtml(content);
        
        // Format code blocks
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
        });
        
        // Format inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Format bold text
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Format line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setProcessingState(isProcessing, sendBtn) {
        this.isProcessing = isProcessing;
        
        if (sendBtn) {
            sendBtn.disabled = isProcessing;
            const btnText = sendBtn.querySelector('.btn-text');
            const spinner = sendBtn.querySelector('.loading-spinner');
            
            if (btnText && spinner) {
                if (isProcessing) {
                    btnText.style.display = 'none';
                    spinner.style.display = 'block';
                } else {
                    btnText.style.display = 'block';
                    spinner.style.display = 'none';
                }
            }
        }
    }
}