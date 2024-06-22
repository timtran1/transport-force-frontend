export function getAttachmentUrl(backendHost, name) {
    return name ? `${backendHost}/attachment/serve/${name}` : '';
}

export function getFileNameFromAttachUrl(url) {
    return url.substring(url.lastIndexOf('/') + 1);
}

export function downloadFromAttachUrl(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.setAttribute('download', getFileNameFromAttachUrl(url));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);
        })
        .catch(error => {
            console.error('Error downloading the file:', error);
        });
}

export function getFileExtension(fileName) {
    return fileName.split('.').pop()
}

export function renameKeys(keysMap, obj) {
    return Object.keys(obj).reduce(
        (acc, key) => ({
            ...acc,
            ...{ [keysMap[key] || key]: obj[key] }
        }),
        {}
    );
}

export function removeKeys(keysArray, obj) {
    let resObj = {...obj};
    keysArray.forEach(k => {
        if (k in resObj) {
            delete resObj[k];
        }
    });
    return resObj;
}

export function randomID(length=9) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
