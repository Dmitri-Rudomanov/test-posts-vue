<script setup>
import { ref, onMounted } from "vue";
import roversApi from "../services/roversApi.js";
import PhotoCards from "./PhotoCards.vue";

const rovers = ref([]);
const roversNames = ref([]);
const selectedName = ref("");
const roverName = ref("");

onMounted(async () => {
  await roversApi
    .fetchRovers()
    .then((result) => (rovers.value = [...result.rovers]));
  roversNames.value = rovers.value.map((item) => item.name);
  selectedName.value = roversNames.value[0];
});

const onSubmit = () => {
  roverName.value = selectedName.value;
};
</script>

<template>
  <div class="bg">
    <h1 class="text">Pick any Rover</h1>
    <form @submit.prevent="onSubmit" class="form">
      <select class="select" v-model="selectedName">
        <option
          v-for="(roverName, index) in roversNames"
          :key="index"
          class="option"
        >
          {{ roverName }}
        </option>
      </select>
      <button class="btn">Search</button>
    </form>
    <PhotoCards v-if="roverName" v-bind:rover-name="roverName" />
  </div>
</template>

<style>
.form {
  display: block;
}
.select {
  width: 200px;
  padding: 5px;
  border: 2px solid rgb(62, 162, 255);
  border-radius: 5px;
  margin: 0 15px 0px 0;
  background-color: whitesmoke;
}
.select:focus {
  outline: none;
  border: 2px solid rgb(255, 62, 62);
}
.btn {
  border: 2px solid rgb(255, 62, 62);
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: all 0.3s ease 0s;
}

.btn:hover {
  background-color: rgb(255, 62, 62);
}

.text {
  font-size: 30px;
  color: white;
}
</style>
