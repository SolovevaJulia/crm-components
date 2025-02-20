export const blobToBase64 = async (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => {
    resolve(reader.result);
  };
  reader.onerror = reject;
});

export const fetchAndConvertImages = async (images) => {
  const urls = await Promise.all(images.map(async (image) => {
    const fetchResponse = await fetch(image, {
      method: 'GET',
      cache: 'no-cache',
    });
    const blob = await fetchResponse.blob();
    const base64Image = await blobToBase64(blob);
    return { originalUrl: base64Image, path: image };
  }));
  return urls;
};
