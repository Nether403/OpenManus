import { AgentSimulator } from './components/agent-simulator.js';
import { TabManager } from './components/tab-manager.js';
import { ChatInterface } from './components/chat-interface.js';

// Initialize the application
class OpenManusApp {
    constructor() {
        this.tabManager = new TabManager();
        this.agentSimulator = new AgentSimulator();
        this.chatInterface = new ChatInterface(this.agentSimulator);
        
        this.init();
    }

    init() {
        // Initialize tab functionality
        this.tabManager.init();
        
        // Initialize chat interface
        this.chatInterface.init();
        
        // Add smooth scrolling for internal links
        this.initSmoothScrolling();
        
        // Add keyboard shortcuts
        this.initKeyboardShortcuts();
        
        console.log('OpenManus Web Demo initialized successfully');
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + Enter to send message
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                this.chatInterface.sendMessage();
            }
            
            // Escape to clear input
            if (e.key === 'Escape') {
                const input = document.getElementById('userInput');
                if (input && document.activeElement === input) {
                    input.blur();
                }
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OpenManusApp();
});