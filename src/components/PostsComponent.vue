<template>
  <div class="bg">
    <h1 class="text">Posts</h1>
    <input
      class="search"
      type="text"
      v-model="filter"
      placeholder="Search title.."
    />
    <ul class="posts">
      <li class="post" v-for="post in filteredPosts" :key="post.id">
        <h2 class="post__title">{{ post.title }}</h2>
        <div class="post__body">{{ post.body }}</div>
        <p class="post__comments">Comments :{{ commentsCheck(post) }}</p>
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
    <div class="chart">
      <h2>CHART</h2>
      <p class="chart__label">axis X=symbols count in user mail</p>
      <p class="chart__label">axis Y=Users count</p>
      <Line id="my-chart-id" :options="chartOptions" :data="mailLength()" />
    </div>
  </div>
</template>

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
  let chartData = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Mail symbols",
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(255, 255, 255, 1)",
        data: Object.values(counts),
      },
    ],
  };
  return chartData;
};
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
.page-link {
  cursor: pointer;
  color: black;
}
.form {
  display: block;
}
.text {
  font-size: 30px;
  color: black;
}
.posts {
  list-style: none;
}
.post {
  margin: 15px 0;
}
.post:not(:last-child) {
  border-bottom: 1px solid rgb(59, 61, 161);
}
.post__body {
  font-size: 18px;
  margin: 0 0 15px 0;
}
.post__comments {
  font-size: 18px;
}
.chart {
  border-radius: 5px;
  background-color: rgb(192, 192, 192);
  padding: 20px;
  margin: 40px 0 0 0;
}
.chart__label {
  font-size: 25px;
}
</style>
