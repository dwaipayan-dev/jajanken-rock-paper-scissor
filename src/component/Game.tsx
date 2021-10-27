import React, {FunctionComponent, useState} from 'react';
import { RouteProps } from 'react-router';
import { setTimeout } from 'timers';
import './Game.css';
import Rock from '../assets/Rock.jpg';
import Paper from '../assets/Paper.jpg';
import Scissor from '../assets/Scissor.jpg';
import Blank from '../assets/Blank.jpg';
import { Link } from 'react-router-dom';

import rockico from '../assets/rock-icon.svg';
import paperico from '../assets/paper-icon.svg';
import scissorico from '../assets/scissor-icon.svg';
import axios from 'axios';


//import 'bootstrap/dist/css/bootstrap.min.css';
class GameComponent extends React.Component {
    state: any = {};
    clicked: boolean = false;
    name: String = "";
    constructor(props: any) {
        super(props);
        this.name = props.match.params.name;
        this.clicked = false;
        this.state = {
            count: 0, freqObj: {
                rock: 0,
                paper: 0,
                scissor: 0
            }, win: 0, draw: 0, loss: 0, clicked: false, hidden: true, saveMessage: "",
            playerImg: String(Blank), computerImg: String(Blank)
        }
        this.increase = this.increase.bind(this)
        //this.waitOneSec = this.waitOneSec.bind(this)
        

    }
    
    componentDidMount(){
        axios.get(`https://jajanken-app-api.herokuapp.com/loadState/${this.name}`).then((res)=>{ 
            console.log(res.data.playerToLoad);
            this.setState({...res.data.playerToLoad})
            
        }).catch((err)=>{
            console.log(err);

        })
    }

    increase() {
        //asynchronous, state does not update until renders.
        this.setState({ ...this.state, count: this.state.count + 1, clicked: true });
        this.waitOneSec();
    }

    waitOneSec() {
        setTimeout(() => {
            this.setState({ ...this.state,  playerImg: String(Blank), 
                computerImg: String(Blank), clicked: false })
        }, 1000);
    }

    saveMyState(){
        let reqBody = {...this.state};
        this.setState({...this.state, hidden: false, saveMessage: "Saving State"});
        axios.post("https://jajanken-app-api.herokuapp.com/saveState", {
            name: this.name,
            state: reqBody
        }).then((response)=>{
            console.log(response);
            this.setState({...this.state, hidden: false, saveMessage: "State Saved"});

            setTimeout(() => {
                this.setState({ ...this.state, hidden: true, saveMessage: ""});
            }, 3000);

        }).catch((err)=>{
            console.log(err);
        })


        
    }

    /*Proof of implementation
let count = 0;
for (let i = 0; i < 100; i++) {
    let u = Math.floor(Math.random() * 100) * (7 / 10);
    let v = Math.floor(Math.random() * 100) * (3 / 10);
    if (v >= u) {
        count += 1;
    }
}
console.log(count);

*/

userSelection(selection: number){
    //asynchronous, state does not update until renders.
    let choices = ["rock", "paper", "scissor"]
    this.setState({ ...this.state, clicked: true });
    this.waitOneSec();
    let userProbArr = this.aiPredictsUserChoice(this.state.freqObj, this.state.count);
    let maxProb = Math.max(...userProbArr);
    let maxProbIndex = [];
    for(let i = 0; i < 3; i++){
        if(userProbArr[i] === maxProb){
            maxProbIndex.push(i);
        }
    }
    let choiceAmongLikely = Math.floor(Math.random() * (maxProbIndex.length - 1))
    let computerChoice = (maxProbIndex[choiceAmongLikely] + 1)%3;
    let playerImage = "";
    let computerImage = "";
    switch(selection){
        case 0:
            playerImage = String(Rock);
            break;
        case 1:
            playerImage = String(Paper);
            break;
        case 2:
            playerImage = String(Scissor);
            break;
        default:
            playerImage = String(Blank);
    }

    switch(computerChoice){
        case 0:
            computerImage = String(Rock);
            break;
        case 1:
            computerImage = String(Paper);
            break;
        case 2:
            computerImage = String(Scissor);
            break;
        default:
            computerImage = String(Blank);
    }

    
    console.log(userProbArr);
    console.log(`User choice is ${choices[selection]}, Computer chose ${choices[computerChoice]}`);
    this.state.freqObj[choices[selection]] += 1;
    console.log(this.state.freqObj);
    if(selection === computerChoice){
        console.log("It is a draw");
        this.setState({...this.state, count: this.state.count + 1, draw: this.state.draw + 1, playerImg: playerImage, 
            computerImg:  computerImage, clicked: true});
    }
    if(computerChoice === (selection + 1)%3){
        console.log("It is a loss");
        this.setState({...this.state, count: this.state.count + 1, loss: this.state.loss + 1, playerImg: playerImage, 
            computerImg:  computerImage, clicked: true});
    }
    if(computerChoice === (selection + 2)%3){
        console.log("It is a win");
        this.setState({...this.state, count: this.state.count + 1, win: this.state.win + 1, playerImg: playerImage, 
            computerImg:  computerImage, clicked: true});
    }
}

aiPredictsUserChoice(freqObj: any, count: number){
    console.log(count);
    if (count === 0) {
        let choiceArr = [];
        choiceArr[0] = Math.floor(Math.random() * 50 + 15);
        choiceArr[1] = Math.floor(Math.random() * 50 + 15);
        choiceArr[2] = Math.floor(Math.random() * 50 + 15);
        return(choiceArr);
    }
    else{
        let choiceArr = [];
        let epsilon = 0.00001; //least propability to avoid multiplication with zero
        let rockBias = (freqObj.rock / count) + epsilon;
        let paperBias = (freqObj.paper / count) + epsilon;
        let scissorBias = (freqObj.scissor / count) + epsilon;
        
        let maxBias = Math.max(rockBias, paperBias, scissorBias);
        //if rock and paper have same user preference history. Prefer Paper
        if(rockBias === paperBias && rockBias === maxBias && rockBias !== scissorBias){
            paperBias = epsilon;
        }

        if(paperBias === scissorBias && paperBias === maxBias && paperBias !== rockBias){
            scissorBias = epsilon;
        }
        
        if(scissorBias === rockBias && scissorBias === maxBias && scissorBias !== paperBias){
            rockBias = epsilon;
        }
        console.log(rockBias, paperBias, scissorBias);
        choiceArr[0] = Math.floor(Math.random() * 50 + 15) * rockBias;
        choiceArr[1] = Math.floor(Math.random() * 50 + 15) * paperBias;
        choiceArr[2] = Math.floor(Math.random() * 50 + 15) * scissorBias;

        return choiceArr;
    }
}


render(){
    return (
        <div className = "mt-5">
            <div className = "float-left ml-2">
                <button className="btn btn-lg btn-outline-light" onClick = {()=>{
                    this.saveMyState()
                    }}>Save Game</button>
            
                <div hidden = {this.state.visibility}>{this.state.saveMessage}</div>
            </div>
        
            <div className = "float-right mr-2">
                
                <Link to= {"/"}>
                    <button className="btn btn-outline-light"><h2><span>&#10060;</span></h2></button>
                </Link>
            </div>

            <h1>Ready {this.name}... Rock... Paper... Scissor... Go!!!!</h1>

            
            <h2>{"Match: " + this.state.count}</h2>
            {/*<h2>{'' + this.state.clicked}</h2>*/}
            {/*<button onClick = {this.increase} disabled = {this.state.clicked}>INCREMENT</button>*/}

            <div className = "row mt-5">
                <h2 className= "col col-4 text-success status">Player Win: {this.state.win}</h2>    
                <h2 className = "col col-4 text-warning status">Draw: {this.state.draw}</h2>  
                <h2 className = "col col-4 text-danger status">CPU Win: {this.state.loss}</h2>
            </div>

            <div className = "row mt-5 mb-5"> 
                <div className = "col-6 col-sm-6">
                    <img className = "imageProp" src={this.state.playerImg}/>
                </div>
                <div className = "col-6 col-sm-6">
                    <img className = "imageProp" src={this.state.computerImg}/>
                </div>
            </div>
            
            <div className = "mb-2">
                <button className= "btn btn-lg btn-danger mr-5 rounded-circle" onClick={()=>{
                    this.userSelection(0)
                } } disabled={this.state.clicked}><img src={String(rockico)} className= "iconProp"/></button>

                <button className="btn btn-lg btn-warning mr-5 rounded-circle" onClick={()=>{
                    this.userSelection(1)
                } } disabled={this.state.clicked}><img src={String(paperico)} className= "iconProp"/></button>

                <button className = "btn btn-lg btn-info rounded-circle" onClick={()=>{
                    this.userSelection(2)
                } } disabled={this.state.clicked}><img src={String(scissorico)} className= "iconProp"/></button>

            </div>
            
        </div> 
    )
}

}

export default GameComponent;