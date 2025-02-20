import axios from 'axios';
import config from '@/config'; // eslint-disable-line import/extensions
import { message } from 'ant-design-vue';

const showErrorMessage = (text) => {
  message.error({
    content: text,
    duration: 5,
  });
};

export const createHttpClient = () => {
  const client = axios.create({
    baseURL: config.apiUrl,
    headers: { Accept: 'application/json' },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      let messageText = error?.response?.data?.message;

      if (error.config && error.config.url) {
        messageText += `\nRequest URL: ${error.config.url}`;
      }

      messageText += `\nPage URL: ${window.location.pathname}`;

      if (messageText) {
        showErrorMessage(messageText);
      }

      if (error?.response?.status >= 500) {
        window.location.href = `/error?message=${encodeURIComponent(messageText)}`;
      }
      throw error;
    },
  );

  return client;
};

export const httpClient = createHttpClient();

