import React, {Component } from 'react';
import PokemonCard from "./PokemonCard";
import { 
	Button,
	Col,
	CardTitle,
	Badge
} from 'reactstrap';
import axios from 'axios';
import Slider from "nouislider";

export default class PokemonList extends Component {
    state = {
        url : "https://pokeapi.co/api/v2/pokemon?offset=0&limit=",
		pokemon: null,
		pokemonSearch: '',
		nbPokemon: 50
	};
	constructor(props) {
		super(props);
		this.child = React.createRef();
	  }

    async componentDidMount() {
    const res = await axios.get(this.state.url + this.state.nbPokemon);
	this.setState({pokemon: res.data});

	var slider1 = this.refs.slider1;
    Slider.create(slider1, {
      start: [this.state.nbPokemon],
      connect: [true, false],
      step: 1,
	  range: { min: 0, max: 50 },
    });

	this.unlisten = this.props.history.listen(async (location, action) => {
		if (this.props.match.params) {
			await this.setState({
				pokemonSearch: this.props.match.params.pokemonIndex
			});
			if (this.state.pokemonSearch !== this.props.match.params.pokemonIndex)
				{
					await this.setState({
						pokemonSearch: this.props.match.params.pokemonIndex
					}, );
				}
				this._handleSubmit();
			console.log(this.props.match.params.pokemonIndex)
		}
	});
	slider1.noUiSlider.on('change', async function () { 
		await this.setState({
			nbPokemon: Math.round(slider1.noUiSlider.get())
		}) 
		const res = await axios.get(this.state.url + this.state.nbPokemon);
		this.setState({pokemon: res.data}); 
	}.bind(this))
}
	
	_handleSubmit() {
		this.refs.child.toggleModalDemo(this.state.pokemonSearch)
	 }

    async next(next){
        const test = await axios.get(next);
        this.setState({pokemon: test.data});
    }

    render(){
        return (
        <React.Fragment>
			<div className="row">
				<Col xs={12} md={6}>
				<CardTitle tag="h4">Pokemon à afficher par page <Badge color="danger" style={{ marginBottom: "10px" }}>{this.state.nbPokemon}</Badge></CardTitle>
				<div className="slider" ref="slider1" />
				</Col>
			</div>
            {this.state.pokemon ?(
                <div className="row">
                    {this.state.pokemon.results.map(pokemon=>(
                            <PokemonCard
							ref="child"
                                key={pokemon.name}
                                name={pokemon.name}
								url={pokemon.url}
                            />
						))}
							{this.state.pokemon.previous !== null ?
											<Button className="btn-round btn-icon" color="primary" onClick={() => this.next(this.state.pokemon.previous)}>
											<i className="tim-icons icon-minimal-left" />
										</Button>
                    :
                    null
                    }
					<Button className="btn-round btn-icon" color="primary" onClick={() => this.next(this.state.pokemon.next)}>
						<i className="tim-icons icon-minimal-right" />
					</Button>
                </div>
                ) :
                    (
                        <h1>Loading Pokemon...</h1>
					)}
        </React.Fragment>
            )
    }
}