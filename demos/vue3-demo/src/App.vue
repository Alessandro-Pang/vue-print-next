<script setup lang="ts">
import {routes} from "./router";

</script>

<template>
  <main class="main">
    <aside class="aside-nav--box">
      <div class="aside-nav">
        <div v-for="item of routes" class="nav-item">
          <router-link :to="item.path">{{item.meta.title}}</router-link>
        </div>
      </div>
    </aside>
    <article class="view">
      <router-view/>
    </article>
  </main>
</template>

<style scoped>
.main {
  height: 100%;
  width: 100%;
  display: flex;
  padding: 20px 10px;
}

.aside-nav--box {
  width: 180px;

}

.aside-nav--box > .aside-nav {
  height: 100%;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 12px;
}

.aside-nav > .nav-item {
  width: 100%;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  text-align: left;
}

.view {
  height: 100%;
  width: 100%;
}
</style>
