<script setup>
import { ref, onMounted, computed } from "vue";
import postsApi from "../services/postsApi.js";
import Paginate from "vuejs-paginate-next";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const posts = ref([]);
const paginatedPosts = ref([]);
const comments = ref([]);
const filter = ref("");
const pageNumber = ref(1);
const chartOptions = ref({ responsive: true });

onMounted(async () => {
  await postsApi.FetchPosts().then((result) => {
    posts.value = result;
    paginatedPosts.value = posts.value.slice(
      pageNumber.value - 1,
      pageNumber.value * 10
    );
  });
  await postsApi.FetchComments().then((result) => (comments.value = result));
});

const commentsCheck = (post) => {
  mailLength();
  return comments.value.filter((comment) => post.id === comment.postId).length;
};
const filteredPosts = computed(() => {
  return paginatedPosts.value.filter((post) => {
    return post.title.toLowerCase().includes(filter.value.toLowerCase());
  });
});

const clickCallback = () => {
  paginatedPosts.value = posts.value.slice(
    pageNumber.value === 1 ? pageNumber.value - 1 : (pageNumber.value - 1) * 10,
    pageNumber.value * 10
  );
};

const mailLength = () => {
  const counts = {};
  const sampleArray = comments.value
    .map((comment) => comment.email.length)
    .sort();
  sampleArray.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  console.log(counts);
  let chartData = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Mail symbols",
        backgroundColor: "#ffff",
        data: Object.values(counts),
      },
    ],
  };
  return chartData;
};
</script>

<template>
  <div class="bg">
    <h1 class="text">Posts</h1>
    <input
      class="search"
      type="text"
      v-model="filter"
      placeholder="Search title.."
    />
    <div>
      <p>x=symbols count in user mail</p>
      <p>y=Users count</p>
      <Line id="my-chart-id" :options="chartOptions" :data="mailLength()" />
    </div>
    <ul>
      <li v-for="post in filteredPosts" :key="post.id">
        <h2>{{ post.title }}</h2>
        <div>{{ post.body }}</div>
        <p>Comments :{{ commentsCheck(post) }}</p>
      </li>
    </ul>
    <paginate
      v-model="pageNumber"
      :page-count="10"
      :page-range="3"
      :margin-pages="2"
      :click-handler="clickCallback"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate>
  </div>
</template>

<style>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
.form {
  display: block;
}
.text {
  font-size: 30px;
  color: white;
}
</style>
