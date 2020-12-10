<template>
	<ul>
		<li v-for="group in groups">
			<poke-group :group="group" ></poke-group>
		</li>
	</ul>
</template>
<script>
	import PokeGroup from './group.vue';
	export default {
		components: {
			PokeGroup: PokeGroup
		},
		props: {
			groups: null
		}
	};
</script>