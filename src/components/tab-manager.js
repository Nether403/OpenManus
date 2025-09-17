/**
 * Manages tab navigation and content switching
 */
export class TabManager {
    constructor() {
        this.activeTab = 'demo';
        this.tabs = ['demo', 'agents', 'tools', 'config'];
    }

    init() {
        // Add click event listeners to nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Set initial active state
        this.switchTab(this.activeTab);
    }

    switchTab(tabName) {
        if (!this.tabs.includes(tabName)) {
            console.warn(`Unknown tab: ${tabName}`);
            return;
        }

        // Update active tab
        this.activeTab = tabName;

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        // Scroll to top when switching tabs
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getCurrentTab() {
        return this.activeTab;
    }
}