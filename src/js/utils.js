
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