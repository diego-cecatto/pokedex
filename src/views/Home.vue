<template>
	<div id="home">
		<div :class=" { extra:!generation.data && !loaded } ">
			<h1> Bem vindo a coleção de gerações de games Pokémon </h1>
			<label>
				Para começarmos, selecione a geração
			</label>
			<select v-model="generation" @change="openGeneration">
				<option v-for="generation in generations" :value="generation"> {{ sanitize(generation.name, true) }}</option>
			</select>
			<div class="description">
				Uma geração é um agrupamento de jogos Pokémon que os separa com base no Pokémon que eles incluem. Em cada geração, um novo conjunto de Pokémon, região, movimentos e habilidades que não existiam na geração anterior são lançados.
			</div>
		</div>
		<div v-if="generation.data">
			<h2> Curiosidades </h2>
			<table id="curiosidades">
				<tbody>
					<tr>
						<td>Número de novos Pokémons</td>
						<td>{{ generation.data.pokemon_species.length }} </td>
					</tr>
					<tr>
						<td>Grupo de Versões</td>
						<td>
							<poke-groups :groups="generation.data.version_groups"></poke-groups>
						</td>
					</tr>
					<tr>
						<td>Região principal</td>
						<td>
							{{ sanitize(generation.data.main_region.name) }}
						</td>
					</tr>
				</tbody>
			</table>
			<h2> Pokémons </h2>
			<div id="search">
				<input type="text" v-model="search" placeholder="Digite aqui o nome do pokemon">
				<span>
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 32 32" id="Glyph" version="1.1" viewBox="0 0 32 32" xml:space="preserve">
						<path d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14 s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0  C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z" id="XMLID_223_"/>
					</svg>
				</span>
				<div id="shadow-mode">
					<label> Modo sombra </label>
					<onoff-toggle v-model="shadow" theme="material" />
				</div>
			</div>
			<ul id="alphabet">
				<li v-for="letter in letters" @click="setLetter(letter)" :class=" { active : searchLetter == letter } ">
					{{ letter }}
				</li>
			</ul>
			<ul id="especies" :class="{ shadow : shadow}">
				<li v-for="specie in generation.data.pokemon_species" v-if="(!searchLetter || searchLetter == specie.name[0]) && (!search || specie.name.toLowerCase().indexOf(search.toLowerCase()) != -1)" >
					{{ specie.name }}
					<div v-if="specie.data && specie.data.pokemon && specie.data.pokemon.data" class="pokemon">
						<img :src="specie.data.pokemon.data.sprites.front_default" width="96" height="96"/>
					</div>
					<div v-else>
						<svg width="90" height="90" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Layer_1" style="enable-background:new 0 0 100 100;" version="1.1" viewBox="0 0 100 100" xml:space="preserve">
							<g>
								<g>
									<path d="M40.3,47.6c1.1-4.4,5-7.6,9.7-7.6c4.7,0,8.6,3.2,9.7,7.6C78.2,47.9,94.5,49,95,51.1c0-0.4,0-0.7,0-1.1 C95,25.1,74.9,5,50,5S5,25.1,5,50c0,0.4,0,0.7,0,1.1C5.5,49.1,21.8,47.9,40.3,47.6z"/>
									<path d="M37.1,57.6C39.7,62.1,44.6,65,50,65c5.4,0,10.2-2.9,12.9-7.4c13.9,0.3,21.9,1,26,1.6C84.7,77.1,68.7,90,50,90 c-18.7,0-34.7-12.9-38.9-30.7C15.2,58.6,23.2,57.9,37.1,57.6 M40.3,52.6c-17.2,0.3-32.5,1.3-35,3.1C8.2,77.8,27.1,95,50,95 c22.9,0,41.8-17.1,44.6-39.3c-2.5-1.8-17.7-2.8-35-3.1c-1.1,4.3-5,7.4-9.7,7.4C45.4,60,41.5,56.8,40.3,52.6L40.3,52.6z"/>
								</g>
								<circle cx="50" cy="50" r="7"/>
							</g>
						</svg>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import axios from 'axios';
	import Vue from 'vue';
	import PokeGroups from './../poke-components/groups.vue';
	import OnoffToggle from 'vue-onoff-toggle'
	export default {
		components: {
			PokeGroups : PokeGroups,
			OnoffToggle: OnoffToggle
		},
		data() {
			return {
				generations: [],
				generation: {
					groups : {
						data : []
					}
				},
				search: '',
				searchLetter: '',
				shadow: false,
				loaded: false
			};
		},
		mounted () {
			axios
				.get(API + 'generation')
				.then(response => (this.generations = response.data.results));
		},
		computed: {
			letters() {
				let letters = []
				for (let i = "A".charCodeAt(0), tot = "Z".charCodeAt(0); i <= tot; i++) {
					letters.push(String.fromCharCode([i]))
				}
				return letters
			}
		},
		methods: {
			openGeneration: function() {
				this.loaded = true;
				this.expand(this.generation, 'data', (response) => {
					console.log(response)
					response.pokemon_species.sort((a, b) => {
						a.name = this.sanitize(a.name);
						b.name = this.sanitize(b.name);
						if (!a.data) {
							a.data = {
								pokemon: null
							}
							this.expand(a, 'data', (data) => {
								for (var variety in data.varieties) {
									variety = data.varieties[variety];
									if (!variety.is_default) {
										continue;
									}
									data.pokemon = variety.pokemon;
									this.expand( data.pokemon, 'data', false);
									break;
								}
								return data;
							});
						}
						if (!b.data) {
							b.data = {
								pokemon: null
							}
							this.expand(b, 'data', (data) => {
								for (var variety in data.varieties) {
									variety = data.varieties[variety];
									if (!variety.is_default) {
										continue;
									}
									data.pokemon = variety.pokemon;
									this.expand( data.pokemon, 'data', false);
									break;
								}
								return data;
							});
						}
						if (a.name < b.name) { return -1; }
						if (a.name > b.name) { return 1; }
						return 0;
					});
					return response;
				});
			},
			expand: function(item, prop, callback) {
				callback = callback || (data => (data));
				axios
					.get(item.url)
					.then(response => (Vue.set(item, prop, callback(response.data))))
					.catch(error => {
						console.log(error)
					});
			},
			setLetter: function(letter) {
				if (this.searchLetter == letter) {
					this.searchLetter = '';
					return;
				}
				this.searchLetter = letter;
			},
			sanitize: function (str, deep) {
				if (deep) {
					var strings = str.split('-');
					return this.sanitize(strings[0]) + ' ' +strings[1].toUpperCase();
				}
				return str[0].toUpperCase() + str.substring(1)
			}
		}
	};
</script>

<style lang="scss">
	.v-toggle_thumb {
		position: absolute;
		transition: all 0.3s;
		border: 1px solid #ccc;
	}
	select {
		border-radius: 10px;
		background: #fff;
		padding: 10px;
	}
	.extra {
		select {
			width: 500px;
			margin-bottom: 16px;
		}

		label {
			font-size: 30px;
			display: block;
			margin-bottom: 8px;
		}
	}
	.description {
		font-size: 13px;
		text-align: left;
	}

	#alphabet {
		display: grid;
		grid-template-columns: repeat(26, 1fr);
		list-style: none;
		padding-left: 0;

		li {
			font-weight: bold;
			cursor: pointer;
			padding: 8px;
		}

		li.active {
			background-color: #f9ca1b;
			border-radius: 10px;
			&:after {
				content: "X";
				font-size: 8px;
				border-radius: 30px;
				color: #494949;
				background: #fff;
				padding: 5px;
			}
		}
	}

	#especies {
		display: grid;
		padding-left: 0;
		list-style: none;
		max-width: 100%;
		grid-template-columns: repeat(3, 1fr);

		&.shadow {
			div.pokemon {
				img {
					filter: brightness(0);
				}
			}
		}

		li {
			border: 1px solid #ccc;
			border-radius: 10px;
			margin-left: 8px;
			margin-bottom: 8px;
			text-align: center;
		}
	}

	#search {
		display: flex;

		input {
			border-radius: 10px 0 0 10px;
			width: 500px;
		}

		span {
			background-color: #f9ca1b;
			border-radius: 0 10px 10px 0;
			padding: 8px;

			svg {
				width: 20px
			}
		}

		#shadow-mode {
			line-height: 40px;
			display: flex;
			padding-left: 20px;

			.v-toggle {
				width: 34px;
				height: 14px;
				margin-top: 10px;
				border-radius: 7px;
				background-color: rgb(159, 159, 159);
				margin-left: 8px;
			}
		}
	}

	table#curiosidades {
		tr {
			td {
				text-align: left;
				padding-left: 8px;
				&:first-child {
					background: #ccc;
					padding-right: 8px;
				}
				ul {
					list-style: none;
					padding-left: 0;
				}
			}
		}
	}
</style>