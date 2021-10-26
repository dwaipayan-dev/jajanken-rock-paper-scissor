import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'
//import 'bootstrap/dist/css/bootstrap.min.css';


class WelcomeComponent extends React.Component{
    state: any = {}
    constructor(props: any){
        super(props);
        this.state = {name: ""};
    }

    updateName(event: any){
        this.setState({name: event.target.value});
    }

    render(){
        return(
            <div className = "welcome-prop">
                <h3 className = "mx-auto col col-sm-7">Welcome to Jajanken. Please enter your name to start a new Game OR continue from your last save.</h3>
                <div className = "mx-auto col col-sm-5 form-group">
                <p className="mt-5 myp">Jajanken is japanese for the Rock, Paper, Scissor game. This is a smart web game where you play against the computer and the computer takes your past moves into account when making it's move. </p>
                <p className="mt-5 myp">Will you surpise the Computer OR will the computer surprise you!!</p>
                <input className = "form-control mt-5" type="text" placeholder = "Your Name..." onChange = {(e)=>{this.updateName(e)}}/>
                </div>

            <Link to= {"/game/" + this.state.name}>
                <button className = "btn btn-dark" type = "button">Let the game begin!!</button>
            </Link>
            </div> 
        )
    }
}

export default WelcomeComponent;