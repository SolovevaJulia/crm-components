const filterByName = (arr, searchText) => arr
  .filter((item) => item.name.toUpperCase().includes(searchText.toUpperCase()));

export { filterByName };
