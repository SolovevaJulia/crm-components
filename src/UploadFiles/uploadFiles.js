import { httpClient } from '@/httpClient';

export const uploadFiles = async ({
  files: originalFiles,
  tagId,
  description,
  references,
  name = null,
  ...options
}) => {
  if (!originalFiles || originalFiles.length === 0) {
    throw new Error('Не выбран ни один файл.');
  }

  const files = [...originalFiles];
  const fd = new FormData();

  const firstFile = files.shift();
  if (!firstFile) throw new Error('Не выбран ни один файл.');
  fd.append('plan', firstFile);

  if (name) fd.append('name', name);
  fd.append('tagId', tagId);
  fd.append('description', description);

  references.forEach((reference, index) => {
    fd.append(`references[${index}]`, reference.originFileObj);
  });

  files.forEach((file) => fd.append('plans[]', file));

  Object.entries(options).forEach(([key, value]) => {
    fd.append(key, typeof value === 'boolean' ? Number(value) : value);
  });

  await httpClient.post('https://jsonplaceholder.typicode.com/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
