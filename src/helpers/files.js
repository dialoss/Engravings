export function getFileType(fileName) {
    if (!fileName) return '';
    let ext = fileName.split('.').slice(-1)[0];
    let type = '';
    if (['png', 'jpg', 'webp'].includes(ext)){
        type = 'image';
    }
    else if (['mp4', 'webm', 'avi', 'mkv'].includes(ext)) {
        type = 'video';
    }
    else if (['stl', 'obj', 'model', 'glb'].includes(ext)) {
        type = 'model';
    }
    else if (['xls', 'xlsx'].includes(ext)) {
        type = 'table';
    }
    else {
        type = 'file';
    }
    return type;
}