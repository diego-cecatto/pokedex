import Vue from "vue";
import App from "./App.vue";
import router from "./router";

global.API = 'https://pokeapi.co/api/v2/';
new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
