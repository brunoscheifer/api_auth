const axios = require('axios')
const express = require("express")
const app = express()
app.use(express.json())

const jwt = require('jsonwebtoken')
const SECRET = 'teste'

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token']
    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) { 
            return res.status(401).end()
        }
        req.userId = decoded.userId
        next()
    })
}

app.post('/login', (req, res) => {
    if(req.body.user === 'eu' && req.body.senha === 'senha') {
        const token = jwt.sign({userId: 1}, SECRET, { expiresIn: 300 })
        return res.json({ auth: true, token})
    }

    res.status(401).end()
})



app.get('/clima/:cidade', verifyJWT, async (req, res) => {
console.log(req.userId + ' fez essa chamada') 
const { cidade } = req.params
    try {
        const resultado = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=b13898ce929b46db5d48384497369308&units=metric`)
        res.status(200).send(resultado.data)
    } catch (error) {
        res.status(500).send(console.error(error));
    }
})

app.listen(3000, () => {
    console.log('Servidor rodando em https://localhost:3000')
})