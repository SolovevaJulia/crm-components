const PlanStatusEnum = {
  'Не принята в работу': { id: -2, color: 'error' },
  Отключено: { id: -1, color: 'default' },
  'Взять в работу': { id: 1, color: 'default' },
  'В процессе': { id: 2, color: 'processing' },
  'Ждет проверки': { id: 3, color: 'warning' },
  Отклонено: { id: 4, color: 'error' },
  Готово: { id: 5, color: 'purple' },
  Одобрено: { id: 6, color: 'success' },
};

export const getStatusTextByNum = (text) => Object.keys(PlanStatusEnum).find((key) => {
  if (PlanStatusEnum[key].id === text) {
    return key;
  }
  return null;
});

export const getStatusColorByNum = (text) => {
  const status = PlanStatusEnum[getStatusTextByNum(text)];
  if (!status) return 'default';
  return status.color;
};

export const getStatusTag = (statusId) => ({
  id: statusId,
  text: getStatusTextByNum(statusId),
  color: getStatusColorByNum(statusId),
});

export default PlanStatusEnum;
