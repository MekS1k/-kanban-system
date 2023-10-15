<template>
  <div class="kanban-board">
    <div class="column">
      <div class="sort-select">
        <label for="todoSortDirection">Необработанные: </label>
        <select
          v-model="todoSortDirection"
          id="todoSortDirection"
          @change="sortProductsByRating('todo')"
        >
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>
      <h2>Необработанные - {{ todoProducts.length }}</h2>
      <draggable
        class="column-content"
        :list="todoProducts"
        group="kanban"
        @change="onDragEnd('todo')"
      >
        <div
          class="card todo-bg"
          :class="getCardClass('todo')"
          v-for="product in todoProducts"
          :key="product.id"
        >
          <div>
            <ProductCard
              :product="product"
              status="todo"
              @edit="editProduct(product)"
            />
            <button class="button-delete" @click="deleteProduct(product)">
              Удалить
            </button>
            <button class="button-edit" @click="editProduct(product)">
              Редактировать
            </button>
          </div>
        </div>
      </draggable>
    </div>

    <div class="column">
      <div class="sort-select">
        <label for="inProgressSortDirection">В работе: </label>
        <select
          v-model="inProgressSortDirection"
          id="inProgressSortDirection"
          @change="sortProductsByRating('inProgress')"
        >
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>
      <h2>В работе - {{ inProgressProducts.length }}</h2>
      <draggable
        class="column-content"
        :list="inProgressProducts"
        group="kanban"
        @change="onDragEnd('inprogress')"
      >
        <div
          class="card inprogress-bg"
          :class="getCardClass('inprogress')"
          v-for="product in inProgressProducts"
          :key="product.id"
        >
          <div>
            <ProductCard
              :product="product"
              status="inprogress"
              @edit="editProduct(product)"
            />
            <button class="button-delete" @click="deleteProduct(product)">
              Удалить
            </button>
            <button class="button-edit" @click="editProduct(product)">
              Редактировать
            </button>
          </div>
        </div>
      </draggable>
    </div>

    <div class="column">
      <div class="sort-select">
        <label for="doneSortDirection">Завершенные: </label>
        <select
          v-model="doneSortDirection"
          id="doneSortDirection"
          @change="sortProductsByRating('done')"
        >
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>
      <h2>Завершенные - {{ doneProducts.length }}</h2>
      <draggable
        class="column-content"
        :list="doneProducts"
        group="kanban"
        @change="onDragEnd('done')"
      >
        <div
          class="card done-bg"
          :class="getCardClass('done')"
          v-for="product in doneProducts"
          :key="product.id"
        >
          <div>
            <ProductCard
              :product="product"
              status="done"
              @edit="editProduct(product)"
            />
            <button class="button-delete" @click="deleteProduct(product)">
              Удалить
            </button>
            <button class="button-edit" @click="editProduct(product)">
              Редактировать
            </button>
          </div>
        </div>
      </draggable>
    </div>

    <div class="window">
      <div class="addProduct">
        <h2>Добавление продукта</h2>
        <input placeholder="Заголовок нового продукта" />
        <input v-model="newProductPrice" placeholder="Цена нового продукта" />
        <input
          v-model="newProductcategory"
          placeholder="Категория нового продукта"
        />
        <button @click="addProduct">Добавить новый продукт</button>
      </div>

      <div v-if="editingProduct" class="editProduct">
        <h2>Редактирование продукта</h2>
        <input v-model="editedProduct.title" placeholder="Название продукта" />
        <input v-model="editedProduct.price" placeholder="Цена продукта" />
        <input
          v-model="editedProduct.category"
          placeholder="Категория продукта"
        />
        <button @click="saveEditedProduct">Сохранить</button>
        <button @click="cancelEdit">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "./ProductCard";
import draggable from "vuedraggable";

export default {
  components: {
    ProductCard,
    draggable,
  },
  data() {
    return {
      todoProducts: [],
      inProgressProducts: [],
      doneProducts: [],
      todoSortDirection: "asc",
      inProgressSortDirection: "asc",
      doneSortDirection: "asc",
      statuses: ["todo", "inprogress", "done"],
      newProductTitle: "",
      newProductPrice: "",
      newProductcategory: "",
      editingProduct: null,
      editedProduct: {
        title: "",
        price: 0,
        category: "",
      },
    };
  },
  created() {
    this.loadProductsFromAPI();
  },
  mounted() {
    this.sortProductsByRating("todo");
    this.sortProductsByRating("inprogress");
    this.sortProductsByRating("done");
  },
  methods: {
    sortProductsByRating(column) {
      if (
        this[`${column}Products`] &&
        Array.isArray(this[`${column}Products`])
      ) {
        const tempProducts = [...this[`${column}Products`]];
        const compareFunction = (a, b) => {
          const direction = this[`${column}SortDirection`];

          if (direction === "asc") {
            return a.rating.rate - b.rating.rate;
          } else {
            return b.rating.rate - a.rating.rate;
          }
        };

        tempProducts.sort(compareFunction);

        // Обновляем данные в текущем столбце
        this[`${column}Products`] = tempProducts;
      }
    },

    getCardClass(status) {
      return {
        todo: status === "todo",
        inprogress: status === "inprogress",
        done: status === "done",
      };
    },
    onDragEnd(column) {
      const columnMappings = {
        todo: "Необработанные",
        inprogress: "В работе",
        done: "Завершенные",
      };

      const cardStatus = columnMappings[column];

      this.todoProducts.forEach((product) => {
        if (product.status === cardStatus) {
          product.status = "todo";
        }
      });

      this.inProgressProducts.forEach((product) => {
        if (product.status === cardStatus) {
          product.status = "inprogress";
        }
      });

      this.doneProducts.forEach((product) => {
        if (product.status === cardStatus) {
          product.status = "done";
        }
      });
    },
    async loadProductsFromAPI() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Ошибка при загрузке продуктов");
        }
        const products = await response.json();
        this.loadProducts(products);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
      }
    },
    loadProducts(products) {
      products.forEach((product) => {
        const status = this.getRandomStatus();
        product.status = status;
        if (status === "todo") {
          this.todoProducts.push(product);
        } else if (status === "inprogress") {
          this.inProgressProducts.push(product);
        } else if (status === "done") {
          this.doneProducts.push(product);
        }
      });
    },
    getRandomStatus() {
      const randomIndex = Math.floor(Math.random() * this.statuses.length);
      return this.statuses[randomIndex];
    },
    async addProduct() {
      try {
        const newProduct = {
          title: this.newProductTitle,
          price: parseFloat(this.newProductPrice),
          description: "",
          image: "https://example.com/image.jpg",
          category: this.newProductcategory,
          status: this.getRandomStatus(),
        };

        const response = await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          throw new Error("Ошибка при добавлении продукта");
        }

        const productData = await response.json();

        if (newProduct.status === "todo") {
          this.todoProducts.push(productData);
        } else if (newProduct.status === "inprogress") {
          this.inProgressProducts.push(productData);
        } else if (newProduct.status === "done") {
          this.doneProducts.push(productData);
        }

        this.newProductTitle = "";
        this.newProductPrice = "";
        this.newProductcategory = "";

        console.log("Новый продукт успешно добавлен:", productData);
      } catch (error) {
        console.error("Ошибка при добавлении продукта:", error);
      }
    },
    editProduct(product) {
      this.editingProduct = product;
      this.editedProduct = {
        title: product.title,
        price: product.price,
        category: product.category,
      };
    },
    async saveEditedProduct() {
      if (this.editingProduct) {
        const updatedProduct = {
          title: this.editedProduct.title,
          price: this.editedProduct.price,
          category: this.editedProduct.category,
        };

        try {
          const response = await fetch(
            `https://fakestoreapi.com/products/${this.editingProduct.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedProduct),
            }
          );

          if (response.ok) {
            this.editingProduct.title = this.editedProduct.title;
            this.editingProduct.price = this.editedProduct.price;
            this.editingProduct.category = this.editedProduct.category;
            this.editingProduct = null;
          } else {
            console.error("Ошибка при обновлении продукта");
          }
        } catch (error) {
          console.error("Ошибка при обновлении продукта:", error);
        }
      }
    },
    cancelEdit() {
      this.editingProduct = null;
      this.editedProduct = {
        title: "",
        price: 0,
        category: "",
      };
    },
    async deleteProduct(product) {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${product.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          this.todoProducts = this.todoProducts.filter(
            (p) => p.id !== product.id
          );
          this.inProgressProducts = this.inProgressProducts.filter(
            (p) => p.id !== product.id
          );
          this.doneProducts = this.doneProducts.filter(
            (p) => p.id !== product.id
          );
        } else {
          console.error("Ошибка при удалении продукта");
        }
      } catch (error) {
        console.error("Ошибка при удалении продукта:", error);
      }
    },
  },
};
</script>
<style scoped>
input {
  min-width: 200px;
  min-height: 20px;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.column {
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: center;
  width: minmax(280px, 1fr);
}

.card {
  margin: 0.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  border-radius: 10px;
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
.addProduct {
  max-width: 250px;
}
.window {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
.editProduct {
  max-width: 250px;
}
select {
  min-width: 200px;
  min-height: 20px;
}
.sort-select {
  margin-bottom: 15px;
}
</style>
