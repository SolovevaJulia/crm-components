import DOMPurify from 'dompurify';

export const sanitizeHTML = (html) => DOMPurify.sanitize(html);
export const parsedText = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};
