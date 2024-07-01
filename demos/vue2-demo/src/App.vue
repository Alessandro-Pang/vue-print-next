<template>
  <main class="main">
    <aside class="aside-nav--box">
      <div class="aside-nav">
        <div v-for="item of routes" class="nav-item" :key="item.path">
          <router-link
              v-if="item.meta?.title"
              :to="item.path"
              class="router-link-item"
              active-class="router-link-active"
              exact-active-class="router-link-active"
          >
            {{ item.meta.title }}
          </router-link>
        </div>
      </div>
    </aside>
    <article class="view">
      <router-view/>
    </article>
  </main>
</template>

<script>
import {routes} from "@/router";

export default {
  name: 'App',
  data(){
    return {
      routes
    }
  }
}
</script>

<style scoped>
.main {
  height: 100%;
  width: 100%;
  display: flex;
  padding: 20px 10px;
}

.aside-nav--box {
  width: 200px;
}

.aside-nav {
  height: 100%;
  padding: 10px;
  background-image: linear-gradient(45deg, #fc4a1a, #b21f1f, #fdbb2d);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease-in-out;
}

.nav-item {
  width: 100%;
}

.router-link-item {
  display: block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  text-align: left;
  color: #fff;
  text-decoration: none;
  padding-left: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.3s, padding-left 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.router-link-item:hover {
  background: rgba(255, 255, 255, 0.3);
  padding-left: 25px;
  color: #fff;
}

.router-link-active {
  background: rgba(255, 255, 255, 0.5);
  color: #000;
  font-weight: bold;
  border-left: 4px solid #fff;
}

.view {
  width: calc(100% - 200px);
  text-align: center;
}
</style>
