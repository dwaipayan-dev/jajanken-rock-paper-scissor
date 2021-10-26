import React from 'react';
import { RouteProps } from 'react-router';
import { setTimeout } from 'timers';
import './Game.css';
import Rock from '../assets/Rock.jpg';
import Paper from '../assets/Paper.jpg';
import Scissor from '../assets/Scissor.jpg';
import Blank from '../assets/Blank.jpg';
//import 'bootstrap/dist/css/bootstrap.min.css';
class GameComponent extends React.Component<RouteProps> {
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
            }, win: 0, draw: 0, loss: 0, clicked: false,
            playerImg: String(Blank), computerImg: String(Blank)
        }
        this.increase = this.increase.bind(this)
        //this.waitOneSec = this.waitOneSec.bind(this)

    }

    componentDidMount(){
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
        choiceArr[0] = Math.floor(Math.random() * 100);
        choiceArr[1] = Math.floor(Math.random() * 100);
        choiceArr[2] = Math.floor(Math.random() * 100);
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
        choiceArr[0] = Math.floor(Math.random() * 100) * rockBias;
        choiceArr[1] = Math.floor(Math.random() * 100) * paperBias;
        choiceArr[2] = Math.floor(Math.random() * 100) * scissorBias;

        return choiceArr;
    }
}


render(){
    return (
        <div className = "mt-5">
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
            

            <button onClick={()=>{
                this.userSelection(0)
            } } disabled={this.state.clicked}>ROCK</button>

            <button onClick={()=>{
                this.userSelection(1)
            } } disabled={this.state.clicked}>PAPER</button>

            <button onClick={()=>{
                this.userSelection(2)
            } } disabled={this.state.clicked}>SCISSOR</button>

            
        </div> 
    )
}

}

export default GameComponent;