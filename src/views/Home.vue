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
			<table>
				<tbody>
					<tr>
						<td>Número de novos Pokémons: </td>
						<td>{{ generation.data.pokemon_species.length }} </td>
					</tr>
					<tr>
						<td>Grupo de Versões</td>
						<td>
							<poke-groups :groups="generation.data.version_groups"></poke-groups>
						</td>
					</tr>
				</tbody>
			</table>
			<div id="search">
				<input type="text" v-model="search" placeholder="Digite aqui o nome do pokemon">
				<span>
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 32 32" id="Glyph" version="1.1" viewBox="0 0 32 32" xml:space="preserve">
						<path d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14 s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0  C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z" id="XMLID_223_"/>
					</svg>
				</span>
				<div>
					<label> Habilitar modo sombra </label>
					<input type="checkbox" v-model="shadow">
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
						<svg width="96" heigth="96" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
							<g>
								<circle cx="62.75" cy="44.25" r="7.375"/><rect x="47.919" y="-4.103" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -20.7107 50)" width="4.163" height="108.207"/>
								<path d="M28,17.5h44c5.79,0,10.5,4.71,10.5,10.5v27.278l-13.143,9.015l14.369,14.369C84.85,76.694,85.5,74.424,85.5,72V28    c0-7.444-6.056-13.5-13.5-13.5H28c-2.423,0-4.694,0.65-6.662,1.773l2.224,2.224C24.912,17.864,26.413,17.5,28,17.5z"/><path d="M60.926,70.075L40,50L17.5,68.047V28c0-1.587,0.364-3.088,0.998-4.438l-2.224-2.224C15.15,23.306,14.5,25.577,14.5,28v44    c0,7.444,6.056,13.5,13.5,13.5h44c2.424,0,4.694-0.65,6.662-1.773L63.349,68.413L60.926,70.075z"/>
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
	export default {
		components: {
			PokeGroups : PokeGroups
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
	}
</style>