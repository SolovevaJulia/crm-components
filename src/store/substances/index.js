import { api } from '@/api';

export default {
  namespaced: true,
  state: {
    stylesList: [],
    typesList: [],
    presetsList: [],
    styleMaterials: [],
    unrealEnvironment: [],
    brandingsList: [],
    defaultPreset: null,
    defaultUnrealEnvironment: 'Default',
  },
  mutations: {
    setStylesList(state, styles) {
      state.stylesList = styles;
    },
    setTypesList(state, types) {
      state.typesList = types;
    },
    setPresetsList(state, presets) {
      state.presetsList = presets.data;
      state.defaultPreset = presets.default;
    },
    setStyleMaterialsList(state, materials) {
      state.styleMaterials = materials;
    },
    setUnrealEnvironment(state, unrealEnvironment) {
      state.unrealEnvironment = unrealEnvironment;
    },
    setBrandingsList(state, brandingsList) {
      state.brandingsList = brandingsList;
    },
  },

  actions: {
    getStylesList(store) {
      return api.getStylesListForFurniture().then((resp) => {
        const { data } = resp;
        store.commit('setStylesList', data);
        return data;
      });
    },
    createStyle(store, request) {
      return api.createStyleForFurniture(request).then((resp) => resp);
    },
    editStyle(store, request) {
      return api.editStyleForFurniture(request).then((resp) => resp);
    },
    deleteStyle(store, id) {
      return api.deleteStyleForFurniture(id).then((resp) => resp);
    },
  },
};
