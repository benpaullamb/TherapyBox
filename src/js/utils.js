
export async function loadPhotos(signal) {
    const countRes = await fetch('/api/photo/count', {
        signal
    });

    const {count: photoCount} = await countRes.json();

    const urls = [];

    for(let i = 0; i < photoCount; ++i) {
        const photoRes = await fetch(`/api/photo?i=${i}`);

        const arrayBuffer = await photoRes.arrayBuffer();
        const blob = new Blob([arrayBuffer]);
        const url = window.URL.createObjectURL(blob);
        urls.push(url);
    }
    
    return urls;
}

export async function savePhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);

    const res = await fetch('/api/photo/upload', {
        method: 'POST',
        body: formData
    });

    return res.status === 200;
}