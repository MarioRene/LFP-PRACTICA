export class FileHandler {
    static loadFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pklfp';
            input.onchange = (event) => {
                const target = event.target;
                const file = target.files?.[0];
                if (!file) {
                    reject(new Error('No file selected'));
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result;
                    if (typeof result === 'string') {
                        resolve(result);
                    }
                    else {
                        reject(new Error('Failed to read file as text'));
                    }
                };
                reader.onerror = () => reject(new Error('Error reading file'));
                reader.readAsText(file);
            };
            input.click();
        });
    }
    static saveFile(content, filename = 'pokemon-team.pklfp') {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
