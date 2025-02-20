import Sortable from 'sortablejs';

export const applyFloorStyles = (container) => {
  const items = container.querySelectorAll('.ant-upload-list-item-name');
  items.forEach((item, index) => {
    const floors = `${index + 1}`;
    if (!item.getAttribute('data-floor')) {
      item.setAttribute('data-floor', floors);
    } else {
      item.setAttribute('data-floor', floors);
    }
  });
};

export const setupFileSorting = (filesList) => {
  let sortable;

  const destroySortable = () => {
    if (sortable) {
      sortable.destroy();
    }
  };

  const createSortable = () => {
    const container = document.querySelector('.ant-upload-list-picture');
    sortable = new Sortable(container, {
      handle: '.ant-upload-list-item-container',
      onEnd: (evt) => {
        const [movedItem] = filesList.value.splice(evt.oldIndex, 1);
        filesList.value.splice(evt.newIndex, 0, movedItem);

        applyFloorStyles(container);

        const items = container.querySelectorAll('.ant-upload-list-item-name');
        items.forEach((item, index) => {
          const floors = `${index + 1}`;
          item.setAttribute('data-floor', floors);
        });
      },
    });
  };

  return {
    createSortable,
    destroySortable,
  };
};
