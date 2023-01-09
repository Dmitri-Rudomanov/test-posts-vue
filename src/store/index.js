import { createStore } from "vuex";

import createPersistedState from "vuex-persistedstate";

const state = {
  markers: [],
};

const actions = {
  allMarkers({ commit }) {
    const stringMarkers = localStorage.getItem("vuex");

    if (JSON.parse(stringMarkers)) {
      commit("setMarkers", JSON.parse(stringMarkers));
    }
  },
  addMarker({ commit }, marker) {
    commit("addMarker", marker);
  },
};

const mutations = {
  addMarker: (state, payload) => {
    state.markers.push(payload);
  },
  setMarkers(state, payload) {
    state.markers = [...payload.markers];
  },
};

const store = createStore({
  state,
  actions,
  mutations,
  plugins: [createPersistedState()],
});
export default store;