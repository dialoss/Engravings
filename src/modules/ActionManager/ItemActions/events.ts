
window.addEventListener('keydown', e => {
    // if e.target === null
    if (e.ctrlKey) {
        switch (e.code) {
            case 'KeyZ':
                return window.actions.history.undo();
            case 'KeyY':
                return window.actions.history.redo();
            case 'KeyC':
                return window.actions.copy();
            case 'KeyX':
                return window.actions.cut();
            case 'KeyV':
                return window.actions.request(window.actions.paste());
            case 'KeyQ':
                return window.actions.history.clear();
        }
    }
    if (e.key === 'Delete') {
        window.actions.request(window.actions.delete());
    }
})