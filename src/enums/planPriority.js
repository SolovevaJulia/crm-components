const planPriority = {
  VeryLow: -2,
  Low: -1,
  Standard: 0,
  High: 1,
  UltraHigh: 2,
};

const planPriorityNames = {
  [planPriority.VeryLow]: 'Очень низкий',
  [planPriority.Low]: 'Низкий',
  [planPriority.Standard]: 'Нормальный',
  [planPriority.High]: 'Высокий',
  [planPriority.UltraHigh]: 'Очень высокий',
};

export { planPriority, planPriorityNames };
