/**
 * Utility functions for markdown processing and text formatting
 */

export class MarkdownProcessor {
    static formatCode(content) {
        // Format code blocks with syntax highlighting
        return content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'text';
            return `<pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>`;
        });
    }

    static formatInlineCode(content) {
        return content.replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    static formatBold(content) {
        return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    static formatItalic(content) {
        return content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    static formatLinks(content) {
        const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;
        return content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static processMarkdown(content) {
        let processed = content;
        
        // Apply formatters in order
        processed = this.formatCode(processed);
        processed = this.formatInlineCode(processed);
        processed = this.formatBold(processed);
        processed = this.formatItalic(processed);
        processed = this.formatLinks(processed);
        
        // Convert line breaks
        processed = processed.replace(/\n/g, '<br>');
        
        return processed;
    }
}

export class TextUtils {
    static truncate(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    static capitalizeFirst(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    static formatTimestamp(date = new Date()) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static extractCodeFromMessage(message) {
        const codeBlocks = [];
        const regex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;
        
        while ((match = regex.exec(message)) !== null) {
            codeBlocks.push({
                language: match[1] || 'text',
                code: match[2].trim()
            });
        }
        
        return codeBlocks;
    }
}