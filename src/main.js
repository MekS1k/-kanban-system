import Vue from "vue";
import App from "./App.vue";
import ProductCard from "./components/ProductCard.vue"; // Импорт компонента ProductCard

Vue.config.productionTip = false;

// Зарегистрируйте компонент ProductCard глобально
Vue.component("ProductCard", ProductCard);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
