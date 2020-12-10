<template>
	<div>
		{{ name }}
	</div>
</template>
<script>
	import axios from 'axios';
	import Utils from './../libs/Utils.js';
	export default {
		props: {
			group: null
		},
		data() {
			return {
				name: ''
			};
		},
		mounted () {
			Utils.requests.get({
				data: this.group,
				callback: (data) => {
					Utils.requests.group({
						groups: data.versions,
						callbacks: {
							single: (description) => {
								var name = '';
								if (!description.names || description.names.length == 0) {
									var name = Utils.sanitize(description.name)
								}
								this.name += ' and ' + (name || description.names[6].name);
							},
							default: () => {
								this.name = this.name.substring(5)
							}
						}
					})
				}
			});
		}
	};
</script>

<style lang="scss">

</style>