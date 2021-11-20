const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')
app.use(express.json())

//ROLLBAR SECTION//////////////////////////////////////////////////////////
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'd03f2c6cd3914ca5b8c0e9ccf36d4bfb',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')
let welcomeResponse = "Welcome to the API"
let newBots = ['The Hammer','Crowbar','Rusty','Beta','Prime Information Drone','Brobot', 'Nozzle', 'Globotron','Self-Aware Garbage Android','Mechi', ]

app.get('/get', function(req, res) {
    rollbar.info('someone tapped the api')
    res.send(welcomeResponse)

    if (newBots.length > 1){
        rollbar.warning("there is more than 1 bot existing in list")
    }
    if (newBots.includes('The Hammer')){
        rollbar.critical("The Hammer is ready for action")
    }
    if (!newBots.includes('Megatron')){
        rollbar.debug("Megatron is NOT in array")
    }    
})

app.put('/put', function(req, res) {
    rollbar.info('someone tried to update')
    res.send('update data')
    .catch((err) => {
        const Error = err
        console.log('ERROR', err)
        Rollbar.error(Error)
    })

})

app.post('/post', function(req,res) {
    res.send('Request')
    if(!newBots.includes('Godzilla')){
        rollbar.critical('POST: Godzilla cannot post')
    }
})

app.delete('/delete', function(req,res) {
    res.send('Delete Request')
    .catch((err) => {
        Rollbar.error('DELETE: BOT cannot be deleted')
    })
})

//ROLLBAR SECTION END/////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/styles', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.css'))
})

app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.js'))
})

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})