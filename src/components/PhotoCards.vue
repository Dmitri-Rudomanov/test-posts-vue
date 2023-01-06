<script setup>
import { ref, onMounted, watchEffect } from "vue";
import roversApi from "../services/postsApi";
const props = defineProps({ roverName: String });
const photos = ref([]);
const sol = ref(1000);
const maxSol = ref();
const error = ref(false);
const page = 1;

const fetchData = async (page, name, solution) => {
  roversApi.FetchRoverFotos(page, name, solution).then((result) => {
    if (result.photos.length === 0) {
      error.value = true;
    } else {
      error.value = false;
      photos.value = result.photos;
    }
  });
  roversApi.FetchRoverTotal(name).then((result) => {
    if (result.photo_manifest) {
      maxSol.value = result.photo_manifest.max_sol;
    }
  });
};

onMounted(async () => {
  await fetchData(page, props.roverName, sol.value);
});

watchEffect(async () => {
  await fetchData(page, props.roverName, sol.value);
});

const onValueSubmit = (e) => {
  sol.value = Number(e.target.sol.value);
};
</script>

<template>
  <p class="text">
    MarsRovers do thousands of pictures in different solution,you can pick any
    number, type it and we will see what we can find
  </p>
  <p class="text">For current rover solution range is 0 to {{ maxSol }}</p>
  <form @submit.prevent="onValueSubmit">
    <input
      name="sol"
      type="number"
      class="input"
      autoFocus
      placeholder="Enter value..."
      min="0"
      :max="maxSol"
    />
    <button class="button">Search</button>
  </form>
  <p v-if="error" class="textError">
    Seems like there is no photos with {{ sol }} solution,try another number
  </p>
  <ul v-else class="list">
    <li v-for="photo in photos" :key="photo.id" class="item">
      <img class="img" :src="photo.img_src" alt="" />
      <div class="textWrapper">
        <p class="textItem">
          Picture made by camera '{{ photo.camera.full_name }}'
        </p>
        <p class="textItem">Picture date is {{ photo.earth_date }}</p>
      </div>
    </li>
  </ul>
</template>

<style>
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
  background-color: gray;
}
.text {
  font-size: 20px;
  color: white;
}
.input {
  padding: 5px;
  width: 200px;
  border: 2px solid rgb(62, 162, 255);
  border-radius: 5px;
  margin: 0 15px 0px 0;
  background-color: whitesmoke;
}
.input:focus {
  outline: none;
  border: 2px solid rgb(255, 62, 62);
}
.button {
  border: 2px solid rgb(255, 62, 62);
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: all 0.3s ease 0s;
}
.button:hover {
  background-color: rgb(255, 62, 62);
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  list-style: none;
}
.item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 50%;
  min-height: 650px;
  max-height: 650px;
  max-width: 500px;
  height: 100%;
  margin: 15px;
  padding: 5px;
  box-shadow: 5px 5px 5px 5px black;
}
.img {
  flex: 1 1 auto;
  display: block;
  width: 100%;
  height: 100%;
  transition: all 0.5s ease 0.2s;
}
.img:hover {
  transform: scale(1.1);
}

.textItem {
  color: white;
  font-size: 18px;
}
.textError {
  color: white;
  font-size: 22px;
}
@media (max-width: 500px) {
  .item {
    flex: 1 1 100%;
    min-height: 100%;
    max-height: 100%;
  }
}
@media (max-width: 420px) {
  .item {
    flex: 1 1 100%;
  }
}
</style>
