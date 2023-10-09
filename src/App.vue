<template>
  <div id="app">
    <header></header>
    <main>
      <KanbanBoard />
    </main>
  </div>
</template>

<script>
import KanbanBoard from "./components/KanbanBoard.vue";

export default {
  components: {
    KanbanBoard,
  },
};
</script>

<style>
/* Add your global styles here */
body {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
