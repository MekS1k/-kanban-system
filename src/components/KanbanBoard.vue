<template>
  <div class="kanban-board">
    <div class="column">
      <h2>Необработанные - {{ todoProducts.length }}</h2>
      <div v-for="product in todoProducts" :key="product.id">
        <div
          class="card todo-bg"
          :class="{
            'inprogress-bg': product.status === 'inprogress',
            'done-bg': product.status === 'done',
          }"
        >
          <ProductCard :product="product" status="todo" />
        </div>
      </div>
    </div>
    <div class="column">
      <h2>В работе - {{ inProgressProducts.length }}</h2>
      <div v-for="product in inProgressProducts" :key="product.id">
        <div
          class="card inprogress-bg"
          :class="{
            'todo-bg': product.status === 'todo',
            'done-bg': product.status === 'done',
          }"
        >
          <ProductCard :product="product" status="inprogress" />
        </div>
      </div>
    </div>
    <div class="column">
      <h2>Завершенные - {{ doneProducts.length }}</h2>
      <div v-for="product in doneProducts" :key="product.id">
        <div
          class="card done-bg"
          :class="{
            'todo-bg': product.status === 'todo',
            'inprogress-bg': product.status === 'inprogress',
          }"
        >
          <ProductCard :product="product" status="done" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todoProducts: [],
      inProgressProducts: [],
      doneProducts: [],
      statuses: ["todo", "inprogress", "done"],
    };
  },
  async created() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const products = await response.json();

      // Распределение продуктов по статусам случайным образом
      products.forEach((product) => {
        const status = this.getRandomStatus();
        product.status = status; // Добавляем статус к каждому продукту
        if (status === "todo") {
          this.todoProducts.push(product);
        } else if (status === "inprogress") {
          this.inProgressProducts.push(product);
        } else if (status === "done") {
          this.doneProducts.push(product);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  methods: {
    getRandomStatus() {
      const randomIndex = Math.floor(Math.random() * this.statuses.length);
      return this.statuses[randomIndex];
    },
  },
};
</script>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(280px, 1fr)
  ); /* Адаптивные столбцы */
  gap: 20px;
}

.column {
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: center;
  /* Ширина столбцов регулируется с помощью minmax */
  width: minmax(280px, 1fr);
}

.card {
  margin: 0.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  border-radius: 10px; /* Увеличил радиус скругления */
  /* Ширина карточек также регулируется с помощью minmax */
  width: minmax(280px, 1fr);
}

.product-card img {
  max-width: 100%;
  height: auto;
}
.product-card {
  border-radius: 10px;
}

.todo-bg {
  background-color: rgb(111, 111, 243); /* Фон для статуса 'todo' */
}

.inprogress-bg {
  background-color: rgb(242, 197, 100); /* Фон для статуса 'inprogress' */
}

.done-bg {
  background-color: rgb(121, 224, 121); /* Фон для статуса 'done' */
}

h2 {
  margin: 0;
}
</style>
