import React from "react";
// reactstrap components
import {
	Input,
	NavbarBrand,
	Navbar,
	NavItem,
	Nav,
	Container,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Col,
	Row,
	Collapse,
	Form,
	FormGroup
  } from "reactstrap";
  import { Link, Redirect } from "react-router-dom";

class ComponentsNavbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pokemonName: '',
			  collapseOpen: false,
			  redirect: false,
		  	color: "navbar-transparent",
		  	colorSearch: "white",
		  	colorInput: "black",
		  	colorIcon: "#171941",
			  focused: ""
		};
	  }
	  componentDidMount() {
		window.addEventListener("scroll", this.changeColor);
	  }
	  componentWillUnmount() {
		window.removeEventListener("scroll", this.changeColor);
	  }
	  changeColor = () => {
		if (
		  document.documentElement.scrollTop > 99 ||
		  document.body.scrollTop > 99
		) {
		  this.setState({
			color: "bg-danger",
			colorSearch: "#171941",
			colorInput: "white",
			colorIcon: "white"
			});
		} else if (
		  document.documentElement.scrollTop < 100 ||
		  document.body.scrollTop < 100
		) {
		  this.setState({
			color: "navbar-transparent",
			colorSearch: "white",
			colorInput: "black",
			colorIcon: "#171941"
		  });
		}
	  };
	  toggleCollapse = () => {
		document.documentElement.classList.toggle("nav-open");
		this.setState({
		  collapseOpen: !this.state.collapseOpen
		});
	  };
	  onCollapseExiting = () => {
		this.setState({
		  collapseOut: "collapsing-out"
		});
	  };
	  onCollapseExited = () => {
		this.setState({
		  collapseOut: ""
		});
	  };
	  scrollToDownload = () => {
		document
		  .getElementById("download-section")
		  .scrollIntoView({ behavior: "smooth" });
	  };
	  onFocus = () => {
		this.setState({
		  focused: "input-group-focus"
		});
	  };
	  onBlur = () => {
		this.setState({
		  focused: ""
		});
	  };
	  handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
		})
	  };
	  onFormSubmit = (e) => {
		e.preventDefault();
        this.setState({
			redirect: true
		})
	 }
  render() {
	var path;
	if (this.state.redirect) {
		path =  <Redirect push to={`/${this.state.pokemonName}`}/>;
		this.setState({
			redirect: false
		})
	}
    return (
<Navbar
className={"fixed-top " + this.state.color}
color-on-scroll="100"
expand="lg"
>
<Container>
  <div className="navbar-translate">
		<NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
			<Link to="/" style={{ color: "white" }}>
				<span>Poké</span> JS
			</Link>
		</NavbarBrand>
	<button
	  aria-expanded={this.state.collapseOpen}
	  className="navbar-toggler navbar-toggler"
	  onClick={this.toggleCollapse}
	>
	  <span className="navbar-toggler-bar bar1" />
	  <span className="navbar-toggler-bar bar2" />
	  <span className="navbar-toggler-bar bar3" />
	</button>
  </div>
  <Collapse
	className={"justify-content-end " + this.state.collapseOut}
	navbar
	isOpen={this.state.collapseOpen}
	onExiting={this.onCollapseExiting}
	onExited={this.onCollapseExited}
  >
	<div className="navbar-collapse-header">
	  <Row>
		<Col className="collapse-close text-right" xs="6">
		  <button
			aria-expanded={this.state.collapseOpen}
			className="navbar-toggler"
			onClick={this.toggleCollapse}
		  >
			<i className="tim-icons icon-simple-remove" />
		  </button>
		</Col>
	  </Row>
	</div>
	<Nav navbar>
	  <NavItem>
		<form onSubmit={this.onFormSubmit}>
					<InputGroup className={this.state.focused} style={{margin: '0', backgroundColor: `${this.state.colorSearch}`, borderRadius: '7px'}}>
					<InputGroupAddon addonType="prepend">
						<InputGroupText>
						<i className="tim-icons icon-zoom-split" style={{color: `${this.state.colorIcon}`}}/>
						</InputGroupText>
					</InputGroupAddon>
					<Input
						style={{color: `${this.state.colorInput}`}}
						type="text"
						name='pokemonName'
						placeholder="Search"
						onFocus={this.onFocus}
						onBlur={this.onBlur}
						onChange={e => this.handleChange(e)}
					/>
					</InputGroup>
		</form>
	  </NavItem>
	</Nav>
  </Collapse>
</Container>
{path}
</Navbar>
    );
  }
}

export default ComponentsNavbar;
