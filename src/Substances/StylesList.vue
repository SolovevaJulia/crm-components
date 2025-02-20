<template>
  <a-row :style="{marginBottom: '1rem'}">
    <a-button
      :style="{ width: '100%', marginBottom: '1rem' }"
      type="primary"
      @click="createModal.open">
      Создать стиль
    </a-button>

    <auto-complete-filter
      v-model:value="searchName"
      :search-list="stylesList"
      @select="handleAutoCompleteSelect" />
  </a-row>

  <div
    ref="scrollContainer"
    class="scroll-container">
    <a-table
      class="custom-scroll-table"
      :loading="isLoading"
      :data-source="filteredList">
      <a-table-column
        key="id"
        :width="100"
        title="ID"
        data-index="id" />

      <a-table-column
        key="number"
        :width="200"
        title="Номер"
        data-index="number" />

      <a-table-column
        key="name"
        :width="300"
        title="Название"
        data-index="name" />

      <a-table-column
        key="id"
        align="right"
        :width="100"
        title=""
        data-index="id">
        <template #default="{record}">
          <a-button
            type="link"
            size="small"
            :disabled="record.type === 'unreal'"
            @click="roomStyleItemsModal.open(record)">
            Оформление
          </a-button>
          <a-button
            type="link"
            size="small"
            @click="updateModal.open(record)">
            Редактировать
          </a-button>
          <a-button
            type="link"
            size="small"
            @click="destroy(record)">
            Удалить
          </a-button>
        </template>
      </a-table-column>
    </a-table>
  </div>

  <!-- CREATE MODAL -->
  <a-modal
    v-model:open="createModal.isOpened"
    centered
    title="Создание стиля"
    ok-text="Сохранить"
    cancel-text="Отменить"
    @ok="create">
    <a-form
      ref="createFormRef"
      layout="vertical"
      :model="createModal.form">
      <a-form-item
        :rules="{required: true}"
        :label="getLocaleText('type')"
        name="type">
        <a-select
          v-model:value="createModal.form.type"
          :options="types" />
      </a-form-item>
      <a-form-item
        :rules="{required: true}"
        :label="getLocaleText('name')"
        name="name">
        <a-input
          v-model:value="createModal.form.name"
          placeholder="Введите название стиля" />
      </a-form-item>
      <a-form-item
        :rules="{required: true, validator: styleNumberValidator}"
        :label="getLocaleText('number')"
        name="number">
        <a-select
          v-if="createModal.form.type === 'web'"
          v-model:value="createModal.form.number"
          :options="webBaseStyleNumbers" />
        <a-input
          v-else
          v-model:value="createModal.form.number"
          placeholder="Введите номер стиля" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- UPDATE MODAL -->
  <a-modal
    v-model:open="updateModal.isOpened"
    centered
    title="Редактирование стиля"
    ok-text="Сохранить"
    cancel-text="Отменить"
    @ok="update">
    <a-form
      ref="updateFormRef"
      layout="vertical"
      :model="updateModal.form">
      <a-form-item
        :label="getLocaleText('type')"
        name="type">
        <a-select
          v-model:value="updateModal.form.type"
          disabled
          :options="types" />
      </a-form-item>

      <a-form-item
        :rules="{required: true}"
        :label="getLocaleText('name')"
        name="name">
        <a-input
          v-model:value="updateModal.form.name"
          placeholder="Введите название стиля" />
      </a-form-item>

      <a-form-item :label="getLocaleText('number')">
        <a-input
          v-model:value="updateModal.form.number"
          disabled />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:open="roomStyleItemsModal.isOpened"
    :footer="null"
    title="Оформление">
    <room-style-items-form
      v-if="roomStyleItemsModal.isOpened"
      :style="roomStyleItemsModal.style"
      @get-list="getList" />
  </a-modal>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { filterByName } from '@/helpers/filterByName';
import { message, Modal } from 'ant-design-vue';
import { useStore } from 'vuex';
import RoomStyleItemsForm from '@/Components/Service/Substances/Forms/RoomStyleItemsForm.vue';
import { tableScroll } from '@/helpers/tableScroll';
import AutoCompleteFilter from '@/Components/Service/Substances/Forms/AutoCompleteFilter.vue';
import '@/assets/styles/scrollStyles.css';

import localeStore from '@/store/locale';

const { getLocaleText } = localeStore();

const roomStyleItemsModal = reactive({
  isOpened: false,
  style: null,
});
roomStyleItemsModal.open = (style) => {
  roomStyleItemsModal.isOpened = true;
  roomStyleItemsModal.style = style;
};

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();
const getList = () => store.dispatch('substances/getStylesList');

const types = [
  { label: 'Unreal', value: 'unreal' },
  { label: 'Web', value: 'web' },
];

const createFormRef = ref();
const createModal = reactive({
  isOpened: false,
  isCreating: false,
  form: {
    name: null,
    number: null,
    type: 'unreal',
  },
});

createModal.open = () => createModal.isOpened = true;

createModal.close = () => {
  createModal.form.name = null;
  createModal.form.number = null;
  createModal.isOpened = false;
};

const updateModal = reactive({
  isOpened: false,
  isCreating: false,
  updateId: null,
  form: {
    id: null,
    name: null,
    type: null,
  },
});

const updateFormRef = ref();
updateModal.open = ({
  id, number, name, type,
}) => {
  updateModal.form.id = id;
  updateModal.form.number = number;
  updateModal.form.name = name;
  updateModal.form.type = type;
  updateModal.isOpened = true;
};

updateModal.close = () => {
  updateModal.form.id = null;
  updateModal.form.name = null;
  updateModal.isOpened = false;
};

const webBaseStyleNumbers = computed(() => {
  const styles = store.state.substances.stylesList;
  const unrealStyles = styles.filter(({ type }) => type === 'unreal');

  return unrealStyles.map(({ number, name }) => ({ label: `${number}. ${name}`, value: number }));
});

const searchName = ref('');

const stylesList = computed(() => store.state.substances.stylesList);

const handleAutoCompleteSelect = (value) => {
  searchName.value = value;
};

const filteredList = computed(() => filterByName(stylesList.value, searchName.value));

const create = async () => {
  createFormRef.value.validate().then(() => {
    store.dispatch('substances/createStyle', createModal.form).then(() => {
      getList();
      message.success('Стиль успешно создан!');
      createModal.close();
    });
  }).catch(() => {
    message.error('Ошибка создания стиля!');
  });
};

const update = async () => {
  updateFormRef.value.validate().then(() => {
    store.dispatch('substances/editStyle', updateModal.form).then(() => {
      getList();
      message.success('Стиль успешно отредактирован!');
      updateModal.close();
    });
  }).catch(() => {
    message.error('Ошибка редактирования стиля!');
  });
};

const destroy = (style) => Modal.confirm({
  title: `Вы уверены, что хотите удалить «${style.name}»?`,
  cancelText: 'Отмена',
  okText: 'Удалить',
  okType: 'danger',
  onOk: () => store.dispatch('substances/deleteStyle', style.id).then(getList),
});

const styleNumberValidator = async (_, value) => {
  const isValueEmpty = !value || /^\s+$/g.test(value);
  if (isValueEmpty) {
    throw Error('Номер стиля не может быть пустым!');
  }

  const isFirstLatinLetter = /[a-z]/.test(value[0]);
  if (!isFirstLatinLetter) {
    throw Error('Номер стиля должен начинаться с буквы a..z!');
  }

  const isTemplatedValue = /^[a-z][a-z0-9]*$/g.test(value);
  if (!isTemplatedValue) {
    throw Error('Неправильный формат! Пример: abc123, test, a66!');
  }
};

const { scrollContainer } = tableScroll();

</script>
