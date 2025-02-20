<template>
  <a-row
    :style="{ position: 'sticky', zIndex: 2, width: '100%', top: '-20px', backgroundColor: '#fff', padding: '1rem 0' }"
    :wrap="true"
    :gutter="[16, 16]">
    <a-col :span="24">
      <a-row
        :span="24"
        :gutter="[16, 16]">
        <a-col
          :span="24"
          :sm="12">
          <a-input-search
            v-model:value="filters.query.name"
            placeholder="Введите имя планировки" />
        </a-col>
        <a-col
          :span="24"
          :sm="12">
          <tag-select
            v-model:value="filters.query.tagIds"
            mode="tags" />
        </a-col>

        <a-col
          :span="24"
          :sm="12"
          :md="6">
          <a-auto-complete
            v-model:value="filters.query.region"
            :options="strategicDataSelect.options.region"
            style="width: 100%"
            placeholder="Введите регион"
            :filter-option="false"
            @search="strategicDataSelect.search(filters.query.region, 'region')"
            @focus="strategicDataSelect.resetOptions()" />
        </a-col>

        <a-col
          :span="24"
          :sm="12"
          :md="6">
          <a-auto-complete
            v-model:value="filters.query.developer"
            :options="strategicDataSelect.options.developer"
            style="width: 100%"
            placeholder="Введите застройщика"
            :filter-option="false"
            @search="strategicDataSelect.search(filters.query.developer, 'developer')"
            @focus="strategicDataSelect.resetOptions()" />
        </a-col>

        <a-col
          :span="24"
          :sm="12"
          :md="6">
          <a-auto-complete
            v-model:value="filters.query.complex"
            :options="strategicDataSelect.options.complex"
            style="width: 100%"
            placeholder="Введите ЖК"
            :filter-option="false"
            @search="strategicDataSelect.search(filters.query.complex, 'complex')"
            @focus="strategicDataSelect.resetOptions()" />
        </a-col>

        <a-col
          :span="24"
          :sm="12"
          :md="6">
          <a-input
            v-model:value="filters.query.address"
            placeholder="Введите адрес" />
        </a-col>

        <a-col
          :span="24"
          :sm="12"
          :md="6">
          <a-button
            :style="{ width: '100%' }"
            type="primary"
            @click="onSubmit">
            Поиск
          </a-button>
        </a-col>
        <a-col
          :span="24"
          :sm="12"
          :md="6">
          <a-button
            :style="{ width: '100%' }"
            type="default"
            @click="resetFilters">
            Сбросить фильтры
          </a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>

  <div
    ref="scrollContainer"
    class="scroll-container">
    <a-table
      :style="{ zIndex: 0 }"
      :data-source="plans"
      :pagination="paginator"
      :loading="isLoading"
      size="small"
      class="custom-scroll-table"
      @change="pageChange">
      <a-table-column
        title="Исходник"
        :width="200">
        <a-space
          direction="vertical">
          <a-space align="center">
            <a-button
              :style="{ padding: '0'}"
              type="link"
              @click="$emit('close')">
              {{ planData.name }}
            </a-button>
          </a-space>
          <a-space
            v-if="type === PlanType.Type3d"
            align="center">
            Стиль:
            <span>{{ getPresetsNameById(planData.preset_id) }}</span>
          </a-space>
        </a-space>
        <image-carousel
          v-if="planImage.length > 1"
          :style="{ maxWidth: '300px', marginTop:'3rem' }">
          <template #images>
            <div
              v-for="(item, index) in planImage"
              :key="item.id">
              <image-viewer>
                <img
                  :style="{ width: '250px', objectFit: 'contain', height: 'auto', margin: '0 auto' }"
                  :src="item"
                  alt="">
              </image-viewer>
              <a-space>
                <span>{{ `${index + 1}/${planImage.length} этаж` }}</span>
              </a-space>
            </div>
          </template>
        </image-carousel>

        <image-viewer v-else>
          <a-space direction="vertical">
            <img
              :style="{ width: '250px', objectFit: 'contain', height: '250px', marginTop:'3rem' }"
              :src="planImage"
              alt="">
            <a-space>
              <span>{{ `${planImage.length}/${planImage.length} этаж` }}</span>
            </a-space>
          </a-space>
        </image-viewer>
      </a-table-column>

      <a-table-column
        key="picture"
        :width="200"
        title="Планировки"
        :style="{ verticalAlign: 'top' }"
        data-index="picture">
        <template #default="{ text, record }">
          <a-space
            direction="vertical">
            <a-space align="center">
              <a
                :href="getPlanUrl(record)"
                target="_blank">
                {{ record.name }}
              </a>
            </a-space>
            <a-space
              v-if="type === PlanType.Type3d"
              align="center">
              Стиль:
              <span>{{ getPresetsNameById(record.preset_id) }}</span>
            </a-space>
            <a-space
              align="center">
              Ниндзя:
              <span>{{ record.ninja ?? 'Отсутствует' }}</span>
            </a-space>
          </a-space>
          <image-viewer :images="[text]">
            <img
              :style="{ width: '250px', objectFit: 'contain', height: '250px', marginTop:'1rem' }"
              :src="text"
              loading="lazy"
              alt="Plan Image">
          </image-viewer>
          <a-space
            align="center">
            Количество этажей:
            <span>{{ record.floors_count ?? 1 }}</span>
          </a-space>
        </template>
      </a-table-column>

      <a-table-column
        :width="100">
        <template #default="{ record }">
          <a-button
            size="small"
            @click="openCompareModal(record)">
            Сравнить
          </a-button>
        </template>
      </a-table-column>

      <a-table-column
        key="crm_tags"
        :width="200"
        title="Теги"
        data-index="crm_tags">
        <template #default="{ text }">
          <a-tag
            v-for="(tag) in text"
            :key="tag.id"
            :style="{
              width: '15rem',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }">
            <a-tooltip placement="topLeft">
              <template #title>
                {{ tag.name }}
              </template>
              {{ tag.name }}
            </a-tooltip>
          </a-tag>
        </template>
      </a-table-column>

      <a-table-column
        key="action"
        :width="100"
        title="Действие"
        data-index="action">
        <template #default="{ record }">
          <a-popconfirm
            title="Cлить с этой планировкой?"
            ok-text="Да"
            cancel-text="Нет"
            @confirm="mergeCrmPlan(record.id)">
            <a-button type="link">
              Слить
            </a-button>
          </a-popconfirm>
        </template>
      </a-table-column>
    </a-table>
  </div>

  <a-modal
    :open="isCompareModalVisible"
    :destroy-on-close="true"
    :footer="null"
    title="Сравнение"
    centered
    :style="{ width: '100%', top: '8px' }"
    @cancel="closeCompareModal">
    <image-viewer :style="{ width: '100%', textAlign: 'center', border: '1px solid #dadada', padding: '.75rem' }">
      <a-row
        type="flex"
        justify="space-around"
        align="middle">
        <a-col
          v-if="type === PlanType.Type2d"
          :span="12">
          <img
            :src="planData.links.svg_editor.svg.length > 0 ? planData.links.svg_editor.svg : planImage[0]"
            :style="{ width: '100%', marginBottom: '1rem', maxHeight: imgMaxHeight, objectFit: 'contain' }"
            alt="Исходник">
        </a-col>
        <a-col
          v-if="type === PlanType.Type3d"
          :span="12">
          <img
            :src="planData.links.svg_editor_images.length > 0 ? planData.links.svg_editor_image : planImage[0]"
            :style="{ width: '100%', maxHeight: imgMaxHeight, objectFit: 'contain' }"
            alt="Планировка">
        </a-col>
        <a-col
          :span="12">
          <img
            :src="samePlan?.svg_result ?? samePlan.picture"
            :style="{ width: '100%', maxHeight: imgMaxHeight, objectFit: 'contain' }"
            alt="Планировка">
        </a-col>
      </a-row>
    </image-viewer>
  </a-modal>
</template>

<script setup>

import {
  onMounted, reactive, ref, computed,
} from 'vue';
import { useStore } from 'vuex';
import _, { pickBy } from 'lodash';
import { api } from '@/api';

import ImageViewer from '@/Components/Common/ImageViewer.vue';
import PlanStatusEnum, { getStatusColorByNum, getStatusTextByNum } from '@/enums/PlanStatusEnum';

import { useStrategicDataSelect } from '@/composables/StrategicDataSelect';
import { PlanType } from '@/enums/planType';
import { tableScroll } from '@/helpers/tableScroll';
import ImageCarousel from '@/Components/Common/ImageCarousel.vue';
import TagSelect from '@/Components/Common/TagSelect.vue';

import { message } from 'ant-design-vue';
import '@/assets/styles/scrollStyles.css';

const getNonEmptyValues = (values) => _.pickBy(values, (i) => !!i);

const props = defineProps({
  planData: {
    default: () => {},
    type: Object,
  },
  type: {
    default: 0,
    type: Number,
  },
  planImage: {
    type: [String, Array],
    default: () => [],
  },
});

const emit = defineEmits(['close', 'update-page']);

const store = useStore();
const plans = ref([]);
const isLoading = ref(false);
const paginator = ref({});

const isCompareModalVisible = ref(false);

store.dispatch('substances/getPresetsList');

const presets = computed(() => store.state.substances.presetsList);

const strategicDataSelect = reactive(useStrategicDataSelect('plans'));

const filters = reactive({
  query: {
    page: 1,
    status: [PlanStatusEnum.Одобрено.id, PlanStatusEnum.Готово.id],
    userIds: null,
    tagIds: props.planData.crm_tags
      .map((tag) => Number(tag.id)) || null,
    name: null,
    type: props.type,
    region: props.planData.region || null,
    developer: props.planData.developer || null,
    complex: props.planData.complex || null,
    address: props.planData.address || null,
    sort: null,
    withSvg: 1,
  },
  users: [],
});

const loadData = async (filter) => {
  isLoading.value = true;
  const params = {
    ...pickBy(filter, (f) => (!!f)),
  };

  const { data } = await api.getServicePlans(props.type, getNonEmptyValues(params));

  paginator.value = {
    total: data.total,
    current: data.currentPage,
    pageSize: data.perPage,
    showSizeChanger: false,
    showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`,
  };

  plans.value = data.items.map((plan) => ({
    ...plan,
    key: plan.id,
    status: {
      id: plan.status,
      text: getStatusTextByNum(plan.status),
      color: getStatusColorByNum(plan.status),
    },
  }));
  plans.value = plans.value.filter((plan) => plan.id !== props.planData.id);
  isLoading.value = false;
};

const pageChange = (pagination, filter, sorter) => {
  if (pagination.current !== paginator.value.current) {
    filters.query.page = pagination.current;
  }

  if (sorter.column?.key === 'name') {
    const sign = sorter.order === 'ascend' ? '' : '-';
    filters.query.sort = sign + sorter.field;
  } else {
    filters.query.sort = null;
  }

  loadData(filters.query);
};
const imgMaxHeight = '500px';

const getPresetsNameById = (id) => {
  const preset = presets.value.find((p) => p.id === id);
  return preset?.name ?? 'Отсутствует';
};

const onSubmit = () => {
  filters.query.page = 1;
  loadData(filters.query);
};

onMounted(() => {
  loadData(filters.query);
  store.dispatch('crm/getSimpleUsersList');
});

const resetFilters = () => {
  filters.query.status = [PlanStatusEnum.Одобрено.id, PlanStatusEnum.Готово.id];
  filters.query.userIds = [];
  filters.query.tagIds = [];
  filters.query.name = null;
  filters.query.region = null;
  filters.query.developer = null;
  filters.query.complex = null;
  filters.query.address = null;
  filters.query.page = 1;

  loadData(filters.query);
};

const mergeCrmPlan = (id) => {
  api.mergeCrmPlan(props.planData.id, {
    crmPlanId: id,
    type: props.type,
  })
    .then(() => {
      message.success('Планировка слита');
      emit('close');
      emit('update-page');
    }, () => message.error('Не удалось слить планировку'));
};

const samePlan = ref(null);

const openCompareModal = (plan) => {
  samePlan.value = plan;
  isCompareModalVisible.value = true;
};
const closeCompareModal = () => {
  isCompareModalVisible.value = false;
};

const { scrollContainer } = tableScroll();

const getPlanUrl = (record) => {
  const id = record?.id;
  if (!id) return '';
  switch (props.type) {
    case PlanType.Type2d: return `/crm/plans/${id}`;
    case PlanType.Type3d: return `/crm/plans/3d/${id}`;
    default: return '';
  }
};

</script>
