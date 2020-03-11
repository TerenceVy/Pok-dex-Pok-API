import React, {Component } from 'react'
import styled from 'styled-components';
import {Redirect} from "react-router-dom";
import { 
	Button,
	Badge, 
	Modal, 
	ModalBody, 
	ModalFooter 
} from 'reactstrap';
import axios from 'axios';

const TYPE_COLORS = {
    dragon: '755EDF',
    bug: 'B1C12E',
    dark: '4F3A2D',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '823551D',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    fire: 'E73B0C',
    ground: 'D3B357',
    ice: 'A3E7FD',
    steel: 'B5B5C3',
    water: '3295F6',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236'
};

const Sprite = styled.img`
width: 5em;
height: 5em;
`;

export default class PokemonCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalDemo: false,
			name:'',
            name1:'',
            name2:'',
            name3:'',
			pokemonIndex:'',
			pokemonIndexSearch:'',
			imageLoading:true,
			toManyRequests: false,
			imageUrl: '',
            imageUrl1: '',
			imageUrl2: '',
			imageUrl3: '',
			imageUrl4: '',
			types: [],
			catchRate: '',
			abilities: '',
            moves: '',
			genderRatioMale: '',
			genderRatioFemale: '',
			description: '',
			statTitleWidth: 3,
			statBarWidth: 9,
			stats: {
				hp: '',
				attack: '',
				defense: '',
				speed: '',
				specialAttack: '',
				specialDefense: ''
			},
			height: '',
			weight: '',
			evs: '',
			hatchSteps: '',
			evolves_to:'',
			redirectEvol:false,
			evolModal:''
		};
		this.toggleModalDemo = this.toggleModalDemo.bind(this);
	}

	async toggleModalDemo(index){
		this.setState({
			modalDemo: !this.state.modalDemo,
		});

		const pokemonIndexModal = index;
        // Urls for pokemon information
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndexModal}/`;
        const pokemonUrl2 = `https://pokeapi.co/api/v2/pokemon/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndexModal}/`;

        // Get Pokemon Information
        const pokemonRes = await axios.get(pokemonUrl);
        const pokemonRes2 = await axios.get(pokemonSpeciesUrl);

        const evolves_toUrl = pokemonRes2.data.evolution_chain.url;
        const pokemonRes3 = await axios.get(evolves_toUrl);

        const name = pokemonRes.data.name;
        //console.log(pokemonRes3);

        const evolves_to1 = pokemonRes3.data.chain.species.name;
        let name1 = evolves_to1;
        let name2 = null;
        let name3 = null;

        const pokemon1 = await axios.get(pokemonUrl2 + evolves_to1);
        const imageUrl1 = pokemon1.data.sprites.front_default;
        let evolves_to2 = null;
        let evolves_to3 = null;

        if (pokemonRes3.data.chain.evolves_to[0]) {
             evolves_to2 = pokemonRes3.data.chain.evolves_to[0].species.name;
             name2 = evolves_to2;
            if (pokemonRes3.data.chain.evolves_to[0].evolves_to[0]) {
                evolves_to3 = pokemonRes3.data.chain.evolves_to[0].evolves_to[0].species.name;
                name3 = evolves_to3;
            }
        }

        let imageUrl5 = null;
        let imageUrl6 = null;


        if (evolves_to2) {
            const pokemon2 = await axios.get(pokemonUrl2 + evolves_to2);
            imageUrl5 = pokemon2.data.sprites.front_default;
        }

        if (evolves_to3) {
            const pokemon3 = await axios.get(pokemonUrl2 + evolves_to3);
            imageUrl6 = pokemon3.data.sprites.front_default;
        }

        //console.log(evolves_to1);
        //console.log(evolves_to2);
        //console.log(evolves_to3);


        const imageUrl = pokemonRes.data.sprites.front_default;
        const imageUrl2 = pokemonRes.data.sprites.back_default;
        const imageUrl3 = pokemonRes.data.sprites.front_shiny;
		const imageUrl4 = pokemonRes.data.sprites.back_shiny;


        let { hp, attack, defense, speed, specialAttack, specialDefense } = '';

        pokemonRes.data.stats.map(stat => {
            switch (stat.stat.name) {
                case 'hp':
                    hp = stat['base_stat'];
                    break;
                case 'attack':
                    attack = stat['base_stat'];
                    break;
                case 'defense':
                    defense = stat['base_stat'];
                    break;
                case 'speed':
                    speed = stat['base_stat'];
                    break;
                case 'special-attack':
                    specialAttack = stat['base_stat'];
                    break;
                case 'special-defense':
                    specialDefense = stat['base_stat'];
                    break;
                default:
                    break;
            }
        });

        const height =
            Math.round((pokemonRes.data.height * 10));

        const weight =
            Math.round((pokemonRes.data.weight / 10));

        const types = pokemonRes.data.types.map(type => type.type.name);

        const themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;

        const abilities = pokemonRes.data.abilities
            .map(ability => {
                return ability.ability.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
            })
            .join(', ');
        console.log(pokemonRes.data);

        const moves = pokemonRes.data.moves
            .map(move => {
                return move.move.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
            })
            .join(', ');

        const evs = pokemonRes.data.stats
            .filter(stat => {
                if (stat.effort > 0) {
                    return true;
                }
                return false;
            })
            .map(stat => {
                return `${stat.effort} ${stat.stat.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')}`;
            })
            .join(', ');

        // Get Pokemon Description .... Is from a different end point uggh
        await axios.get(pokemonSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some(flavor => {
                if (flavor.language.name === 'en') {
                    description = flavor.flavor_text;
                    return;
                }
            });
            const femaleRate = res.data['gender_rate'];
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 - femaleRate);

            const catchRate = Math.round((100 / 255) * res.data['capture_rate']);

            const eggGroups = res.data['egg_groups']
                .map(group => {
                    return group.name
                        .toLowerCase()
                        .split(' ')
                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ');
                })
                .join(', ');

            const hatchSteps = 255 * (res.data['hatch_counter'] + 1);

            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps,
            });
        });

        this.setState({
            imageUrl,
            imageUrl1,
            imageUrl2,
            imageUrl3,
            imageUrl4,
            imageUrl5,
            imageUrl6,
            pokemonIndexModal,
            name,
            name1,
            name2,
            name3,
            types,
            stats: {
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            themeColor,
            height,
            weight,
            abilities,
            moves,
            evs,
		});

	}

	_evolToggle(name) {
		this.toggleModalDemo(this.state.pokemonIndex);
		this.setState({
			redirectEvol: true,
			evolModal: name
		})
	}

    componentDidMount() {
        const name = this.props.name;

        const url = this.props.url;
        const pokemonIndex = url.split("/")[url.split('/').length -2]
        const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`

        const imageUrl1 = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${this.state.evolves_to}.png?raw=true`
        const imageUrl5 = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${this.state.evolves_to}.png?raw=true`
        const imageUrl6 = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${this.state.evolves_to}.png?raw=true`
        //console.log (this.state)
        this.setState({name:name, imageUrl:imageUrl,imageUrl5:imageUrl5,imageUrl6:imageUrl6,imageUrl1:imageUrl1, pokemonIndex:pokemonIndex,name1:this.state.evolves_to,name2:this.state.evolves_to,name3:this.state.evolves_to});
	}

    render(){
        let searchResults = this.props.pokeDetails;
        if (this.props.search) {
            searchResults = searchResults.filter(data => data.name.startsWith(this.props.search.text));
		}
		
		if (this.state.redirectEvol) {
			this.setState({
				redirectEvol: false
			})
			return <Redirect push to={`/${this.state.evolModal}`}/>;
		}
        return (
            <div className="col-md-2 col-sm-6 mb-5" style={{marginTop: '25px'}} onClick={() => this.toggleModalDemo(this.state.pokemonIndex)}>
			<Modal isOpen={this.state.modalDemo} toggle={() => this.toggleModalDemo(this.state.pokemonIndex)}>
			<div className="modal-header">
			  <button
				type="button"
				className="close"
				data-dismiss="modal"
				aria-hidden="true"
				onClick={() => this.toggleModalDemo(this.state.pokemonIndex)}
			  >
				<i className="tim-icons icon-simple-remove" />
			  </button>
			</div>
			<ModalBody>
			<div className="col">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-7">
                                <div className="float-right">
                                    {this.state.types.map(type => (
                                        <span
                                            key={type}
                                            className="badge badge-pill mr-1"
                                            style={{
                                                backgroundColor: `#${TYPE_COLORS[type]}`,
                                                color: 'white'
                                            }}
                                        >
                                        {type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className=" col-md-3 ">
                                <img
                                    src={this.state.imageUrl}
                                    className=""
                                />
                                <img
                                    src={this.state.imageUrl2}
                                    className=""
                                />
                                <img
                                    src={this.state.imageUrl3}
                                    className=""
                                />
                                <img
                                    src={this.state.imageUrl4}
                                    className=""
                                />
                            </div>
                            <div className="col-md-9">
                                <h4 className="mx-auto">
                                    {this.state.name
                                        .toLowerCase()
                                        .split(' ')
                                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                        .join(' ')}
                                </h4>
                                <div className="row align-items-center">
                                    <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                                        HP
                                    </div>
                                    <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                                        <div className="progress">
                                            <div
                                                className="progress-bar "
                                                role="progressbar"
                                                style={{
                                                    width: `${this.state.stats.hp}%`,
                                                    backgroundColor: `#${this.state.themeColor}`
                                                }}
                                                aria-valuenow="10"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                <small>{this.state.stats.hp}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                                        Att
                                    </div>
                                    <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                                        <div className="progress">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${this.state.stats.attack}%`,
                                                    backgroundColor: `#${this.state.themeColor}`
                                                }}
                                                aria-valuenow="10"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                <small>{this.state.stats.attack}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                                        Def
                                    </div>
                                    <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                                        <div className="progress">
                                            <div
                                                className="progress-bar "
                                                role="progressbar"
                                                style={{
                                                    width: `${this.state.stats.defense}%`,
                                                    backgroundColor: `#${this.state.themeColor}`
                                                }}
                                                aria-valuenow="10"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                <small>{this.state.stats.defense}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                                        Spe
                                    </div>
                                    <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                                        <div className="progress">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${this.state.stats.speed}%`,
                                                    backgroundColor: `#${this.state.themeColor}`
                                                }}
                                                aria-valuenow="10"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                <small>{this.state.stats.speed}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                                        SpA
                                    </div>
                                    <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                                        <div className="progress">
                                            <div
                                                className="progress-bar "
                                                role="progressbar"
                                                style={{
                                                    width: `${this.state.stats.specialAttack}%`,
                                                    backgroundColor: `#${this.state.themeColor}`
                                                }}
                                                aria-valuenow={this.state.stats.specialAttack}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                <small>{this.state.stats.specialAttack}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                                        SpD
                                    </div>
                                    <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                                        <div className="progress">
                                            <div
                                                className="progress-bar "
                                                role="progressbar"
                                                style={{
                                                    width: `${this.state.stats.specialDefense}%`,
                                                    backgroundColor: `#${this.state.themeColor}`
                                                }}
                                                aria-valuenow={this.state.stats.specialDefense}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                <small>{this.state.stats.specialDefense}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col">
                                <p className="" style={{ color: 'white' }}>{this.state.description}</p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="card-body">
                        <h5 className="card-title text-center">Profile</h5>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-6">
                                        <h6 className="float-right">Height:</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-left">{this.state.height} cm</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-right">Weight:</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-left">{this.state.weight} kg</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-right">Catch Rate:</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-left">{this.state.catchRate}%</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-right">Gender Ratio:</h6>
                                    </div>
                                    <div className="col-6">
                                        <div className="progress">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${this.state.genderRatioFemale}%`,
                                                    backgroundColor: '#c2185b'
                                                }}
                                                aria-valuenow="15"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                <small>{this.state.genderRatioFemale}</small>
                                            </div>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${this.state.genderRatioMale}%`,
                                                    backgroundColor: '#1976d2'
                                                }}
                                                aria-valuenow="30"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                <small>{this.state.genderRatioMale}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-6">
                                        <h6 className="float-right">Egg Groups:</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-left">{this.state.eggGroups} </h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-right">Hatch Steps:</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-left">{this.state.hatchSteps}</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-right">Abilities:</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-left">{this.state.abilities}</h6>
                                    </div>
                                    <br />
                                    <div className="col-6">
                                        <h6 className="float-right">Moves:</h6>
                                    </div>
                                    <div className="col-6" style={{ height: "100px", overflowY: "scroll"}}>
                                        <h6 className="float-left">{this.state.moves}</h6>
                                    </div>
                                    <br />
                                    <div className="col-6">
                                        <h6 className="float-right">EVs:</h6>
                                    </div>
                                    <div className="col-6">
                                        <h6 className="float-left">{this.state.evs}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="box" onClick={() => this._evolToggle(this.state.name1)}>
                                                <img
													src={this.state.imageUrl1}
                                                />
                                                <center><h5>{this.state.name1}</h5></center>

                                            </div>
                                            <div className="box" onClick={() => this._evolToggle(this.state.name2)}>
                                                <img
                                                    src={this.state.imageUrl5}
                                                />
                                                <center><h5>{this.state.name2}</h5></center>
                                            </div>
                                            <div className="box" onClick={() => this._evolToggle(this.state.name3)}>
                                                <img
                                                    src={this.state.imageUrl6}
                                                />
                                                <center><h5>{this.state.name3}</h5></center>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
			</ModalBody>
			<ModalFooter>
				<Button color="secondary" onClick={() => this.toggleModalDemo(this.state.pokemonIndex)}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
                
                <div style={{ backgroundColor: "#fd5d93", padding: "10px", borderRadius: "5px" }}>
				<Badge color="default" style={{ marginBottom: "10px" }}>{this.state.pokemonIndex}</Badge>
                <div className="card" style={{ marginBottom: "10px" }}>
                    <Sprite className="card-im-top rounded mx-auto mt-2" src={this.state.imageUrl}
                        onLoad={() => this.setState({imageLoading:false})}
                            onError={() => this.setState({toManyRequests:true})}
                    />
                </div>
				<h4 className="card-title" style={{ color: "#32325d", fontWeight: 'bold', margin: '0' }}>
                            {this.state.name
                                .toLowerCase()
                                .split(' ')
                                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                .join(' ')}
                </h4>
				</div>
            </div>
        )
    }
}