# Rock Paper Scissor Web Game(Project Jajanken)
This is a web application featuring a Rock Paper Scissor UI which is able to save game state using MongoDb database via Node js backend. The game is Player against Computer but the Computer will not make random guesses but probable guesses as the app also features a simple AI which gives more preference to the move which would draw or beat the move it thinks the player would probably make based on the history of earlier moves. This was my first React project and I am grateful to Adya.care team for giving me the opportunity to work on this project. Thr backend code is in the following repository: https://github.com/dwaipayan-dev/jajankenAPI

# Prerequisites:
I have made a build file that I am yet to serve on Heroku. So you need a server to run it. You can use npm serve which would host your index.html page on a local server.
```
npm install -g serve
```
To run the project go to "build" folder and then in the terminal type
```
serve
```
This will initiate a node server and serve the index.html file. Go to the given URL in the terminal to see the web project in action

# Usage
By default the game opens in '/' endpoint. This is a welcome page. It has an input field where you can enter your gamename. After giving a name and clicking submit. It would take you to '/game/:your-gamename' endpoint which has the main rock paper scissors game. If you have any saved a game state before using the same gamename it would load the saved state into the game. The game window also has a cross icon for navigating back to welcome page and a save game button which on pressing would save the current state(win, loss, match count etc.) to a mongoDB cloud database via an API hosted on heroku. About the game, I do wish to spoil the surprise so why don't you check it out!!


# Final Note
I have tried my level best to make this simple rock paper scissor game interesting to players. I admit there are a lot of things that could be improved but given this was my first project on React, I feel good about what I have made. I am always open to feedback and if you come across any issues feel free to contact me. Thank you for reading this far.

