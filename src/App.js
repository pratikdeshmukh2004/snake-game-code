import React, { Component } from "react";
import Tick from "./Audios/Tick-DeepFrozenApps-397275646.mp3"
import Eat from "./Audios/zapsplat_human_eat_bite_apple_004_15223.mp3"
import Over from "./Audios/game-over-sound-effect.mp3"
import Snake from "./Snake";
import Food from "./Food";
import swal from "sweetalert";

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};
var audio = new Audio(Tick)
var audio2 = new Audio(Eat)
var over = new Audio(Over)

const initialState = {
  food: getRandomCoordinates(),
  speed: 200,
  direction: "RIGHT",
  snakeDots: [
    [0, 0],
    [2, 0],
  ],
};

export class App extends Component {
  state = initialState;

  componentDidMount() {
    this.setState({ snakeDots: [] });
    swal({
      title: "Press Start Button To Start The Game.",
      button: "Start",
    }).then(() => {
      this.setState(initialState);
    });
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    if (this.state.snakeDots.length > 0) {
      this.checkIfOutOfBorders();
    //   this.checkIfCollapsed();
      this.checkIfEat();
    }
  }
  onKeyDown = (e) => {
   
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        this.setState({ direction: "UP" });
        audio.pause()
        audio.play()
        break;
      case 40:
        this.setState({ direction: "DOWN" });
        audio.pause()
        audio.play()
        break;
      case 37:
        this.setState({ direction: "LEFT" });
        audio.pause()
        audio.play()
        break;
      case 39:
        this.setState({ direction: "RIGHT" });
        audio.pause()
        audio.play()
        break;
    }
  };

  moveSnake = () => {
    if (this.state.snakeDots.length > 0) {
      let dots = [...this.state.snakeDots];
      let head = dots[dots.length - 1];
      switch (this.state.direction) {
        case "RIGHT":
          head = [head[0] + 2, head[1]];
          break;
        case "LEFT":
          head = [head[0] - 2, head[1]];
          break;
        case "DOWN":
          head = [head[0], head[1] + 2];
          break;
        case "UP":
          head = [head[0], head[1] - 2];
          break;
      }

      dots.push(head);
      dots.shift();
      this.setState({
        snakeDots: dots,
      });
    }
  };

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    });
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      audio2.play()
      this.setState({
        food: getRandomCoordinates(),
      });
      this.enlargeSanke();
      this.increaseSpeed();
    }
  }

  enlargeSanke() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([]);
    this.setState({
      snakeDots: newSnake,
    });
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 100               ,
      });
    }
  }

  onGameOver() {
    over.play()
    this.setState({
      snakeDots: [],
    });
    swal(
      `Game Over. Snake Length Is ${this.state.snakeDots.length}.`,
      "",
      "warning",
      { buttons: ["Close", "Start"] }
    ).then((b) => {
      if (b) {
        swal({
          title: "Welcome Back TO Snake Game.",
          icon: "success",
          button: "Start",
        }).then(() => {
          this.setState(initialState);
        });
      }else{
          window.close()
      }
    });
  }
  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Snake Game</h1>
        <div className="score-board">
            <h3>Live Score<b style={{float: "right"}}>Length : {this.state.snakeDots.length}</b></h3>
        </div>
        <div className="game-area">
          <Snake snakeDots={this.state.snakeDots} />
          <Food dot={this.state.food} />
          
        </div>
      </div>
    );
  }
}

export default App;
