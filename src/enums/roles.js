const rolesList = [
  { id: 1, title: 'admin', startPage: '/crm/plans' },
  { id: 2, title: 'user', startPage: '/plans' },
  { id: 3, title: 'ninja', startPage: '/crm/my-plans' },
  { id: 4, title: 'manager', startPage: '/crm/plans' },
  { id: 5, title: 'cutter', startPage: '/crm/plans' },
  { id: 6, title: 'external user', startPage: '/plans' },
  { id: 7, title: 'supervisor', startPage: '/crm/apartments' },
];

export const Role = {
  Admin: 1,
  User: 2,
  Ninja: 3,
  Manager: 4,
  Cutter: 5,
  ExternalUser: 6,
  Supervisor: 7,
};

export const getRoleById = (id) => rolesList.find((role) => role.id === id);

export default rolesList;
