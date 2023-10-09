<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.title" class="product-image" />
    <h3>{{ product.title }}</h3>
    <p>ID: {{ product.id }}</p>
    <p>Price: ${{ product.price }}</p>
    <p>Category: {{ product.category }}</p>
    <p>Status: {{ status }}</p>
  </div>
</template>

<script>
export default {
  props: {
    product: Object,
    status: String,
  },
};
</script>

<style scoped>
.product-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin: 0.5rem;
  text-align: left;
  background-color: #f9f9f9;
  max-width: 290px;
}

.product-image {
  height: auto;
  max-width: 12%;
}
</style>
