export class SyntaxHighlighter {
    static highlightSyntax(code) {
        let highlighted = code;
        // Highlight reserved words (blue)
        Object.keys(this.TOKEN_COLORS).forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const color = this.TOKEN_COLORS[word] || '#2196f3';
            highlighted = highlighted.replace(regex, `<span style="color: ${color}; font-weight: bold;">$&</span>`);
        });
        // Highlight strings (orange)
        highlighted = highlighted.replace(/"[^"]*"/g, '<span style="color: #ff9800;">$&</span>');
        // Highlight numbers (purple)
        highlighted = highlighted.replace(/\b\d+\b/g, '<span style="color: #9c27b0;">$&</span>');
        // Preserve line breaks
        highlighted = highlighted.replace(/\n/g, '<br>');
        return highlighted;
    }
}
SyntaxHighlighter.TOKEN_COLORS = {
    'Jugador': '#2196f3',
    'salud': '#2196f3',
    'ataque': '#2196f3',
    'defensa': '#2196f3',
    'agua': '#2196f3',
    'fuego': '#2196f3',
    'planta': '#2196f3',
    'normal': '#2196f3',
    'psiquico': '#2196f3',
    'dragon': '#2196f3',
    'bicho': '#2196f3'
};
export class Editor {
    constructor(textAreaId, highlightDivId) {
        this.textArea = document.getElementById(textAreaId);
        this.highlightDiv = document.getElementById(highlightDivId);
        if (this.textArea && this.highlightDiv) {
            this.setupSyntaxHighlighting();
        }
    }
    setupSyntaxHighlighting() {
        if (!this.textArea || !this.highlightDiv)
            return;
        const updateHighlight = () => {
            if (!this.textArea || !this.highlightDiv)
                return;
            const code = this.textArea.value;
            this.highlightDiv.innerHTML = SyntaxHighlighter.highlightSyntax(code);
            this.synchronizeScroll();
        };
        this.textArea.addEventListener('input', updateHighlight);
        this.textArea.addEventListener('scroll', () => this.synchronizeScroll());
        this.textArea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab();
            }
        });
        // Initial highlight
        updateHighlight();
    }
    synchronizeScroll() {
        if (!this.textArea || !this.highlightDiv)
            return;
        this.highlightDiv.scrollTop = this.textArea.scrollTop;
        this.highlightDiv.scrollLeft = this.textArea.scrollLeft;
    }
    insertTab() {
        if (!this.textArea)
            return;
        const start = this.textArea.selectionStart;
        const end = this.textArea.selectionEnd;
        this.textArea.value = this.textArea.value.substring(0, start) +
            '    ' +
            this.textArea.value.substring(end);
        this.textArea.selectionStart = this.textArea.selectionEnd = start + 4;
        this.textArea.dispatchEvent(new Event('input'));
    }
    getValue() {
        return this.textArea?.value || '';
    }
    setValue(value) {
        if (this.textArea) {
            this.textArea.value = value;
            this.textArea.dispatchEvent(new Event('input'));
        }
    }
    clear() {
        this.setValue('');
    }
}
//# sourceMappingURL=Editor.js.map