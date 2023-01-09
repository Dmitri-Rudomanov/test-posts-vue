<template>
  <div class="create-marker">
    <p class="create-marker__text">You can create marker from a scratch</p>
    <button class="create-marker__btn" @click="editCoordinates()" type="button">
      Create
    </button>
  </div>
  <div class="modal__container" v-if="isModalOpen">
    <form @submit.prevent="createMarker()" class="modal__form">
      <span class="modal__span">Marker name</span>
      <input
        class="modal__marker"
        v-model="currentMarker.markerName"
        type="text"
      />
      <div class="modal__latlng">
        <span class="modal__span">LAT</span>
        <input
          class="modal__lat"
          type="number"
          v-model="currentMarker.markerLat"
          :disabled="coordinatesEditor ? false : true"
        /><br />
        <span class="modal__span">LNG</span
        ><input
          class="modal__lng"
          type="number"
          v-model="currentMarker.markerLng"
          :disabled="coordinatesEditor ? false : true"
        />
      </div>
      <div class="modal__buttons">
        <button id="create" class="modal__create" type="submit">Create</button>
        <button
          id="close"
          class="modal__close"
          v-if="coordinatesEditor"
          @click="closeModal()"
        >
          Close
        </button>
      </div>
    </form>
  </div>
  <div id="map" class=""></div>
</template>

<script setup>
import leaflet from "leaflet";
import uniqid from "uniqid";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const markerData = ref([]);
const currentMarker = ref({
  markerId: "",
  markerName: "",
  markerLat: "",
  markerLng: "",
});
const isModalOpen = ref(false);
const coordinatesEditor = ref(false);
const store = useStore();

let map;

onMounted(() => {
  map = leaflet.map("map").setView([48.383022, 31.1828699], 6);
  leaflet
    .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })
    .addTo(map);
  map.on("click", onMapClick);
  store.dispatch("allMarkers");
  store.state.markers.map((marker) => {
    leaflet
      .marker([marker.markerLat, marker.markerLng])
      .bindPopup(`<b>${marker.markerName}</b>`)
      .on("mouseover", (e) => e.target.openPopup())
      .addTo(map);
  });
});

function onMapClick(e) {
  currentMarker.value = {
    markerId: uniqid(),
    markerName: "",
    markerLat: e.latlng.lat,
    markerLng: e.latlng.lng,
  };
  markerData.value = [...markerData.value, currentMarker.value];
  leaflet
    .marker([currentMarker.value.markerLat, currentMarker.value.markerLng])
    .addTo(map);
  store.dispatch("addMarker", currentMarker.value);
  isModalOpen.value = true;
  coordinatesEditor.value = false;
}
function closeModal() {
  currentMarker.value = {
    markerId: "",
    markerName: "",
    markerLat: "",
    markerLng: "",
  };
  isModalOpen.value = false;
  coordinatesEditor.value = false;
}
function createMarker() {
  if (coordinatesEditor.value) {
    currentMarker.value.markerId = uniqid();
    leaflet
      .marker([currentMarker.value.markerLat, currentMarker.value.markerLng])
      .bindPopup(`<b>${currentMarker.value.markerName}</b>`)
      .addTo(map)
      .on("mouseover", (e) => e.target.openPopup());

    markerData.value = [...markerData.value, currentMarker.value];
  }
  if (!currentMarker.value.markerName.trim()) {
    currentMarker.value.markerName = "Unnamed marker";
  }

  store.dispatch("addMarker", currentMarker.value);
  currentMarker.value = {
    markerId: "",
    markerName: "",
    markerLat: "",
    markerLng: "",
  };
  isModalOpen.value = false;
  coordinatesEditor.value = false;
}
function editCoordinates() {
  isModalOpen.value = true;
  coordinatesEditor.value = true;
}
</script>

<style>
#map {
  height: 600px;
}
.modal__container {
  z-index: 1000;
  position: absolute;
  width: 200px;
  height: 300px;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: gray;
}
.modal__form {
  height: 100%;
  padding: 15px;
}
.modal__marker {
  width: 100%;
}
.modal__span {
  display: inline-block;
  margin-right: 10px;
}
.modal__latlng {
  margin-top: 15px;
}
.modal__lat {
  font-size: 15px;
  width: 100%;
}
.modal__lng {
  font-size: 15px;
  width: 100%;
}
.modal__buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.modal__create {
  cursor: pointer;
  background-color: greenyellow;
}
.modal__close {
  cursor: pointer;
  background-color: red;
}
.create-marker {
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
}
.create-marker__text {
  font-size: 18px;
  font-weight: bold;
  margin-right: 15px;
}
.create-marker__btn {
  font-size: 18px;
  font-weight: bold;
  width: 100px;
  padding: 15px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
