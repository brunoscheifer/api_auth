const axios = require('axios')
const express = require("express")
const app = express()
app.use(express.json())
const bcrypt = require("bcrypt")
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const jwt = require('jsonwebtoken')

mongoose
  .connect('mongodb://localhost:27017/usuarios')
  .then(() => {
    console.log("Conectado");
  })
  .catch((erro) => {
    console.error("Erro ao conectar", erro);
  });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    senha: { type: String, required: true}
})

const User = mongoose.model('User', userSchema)

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token']
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) { 
            return res.status(401).end()
        }
        req.userId = decoded.userId
        next()
    })
}

app.post('/signup', async (req, res) => {
    const { username, senha } = req.body;

    // Validação de entrada
    if (!username || !senha) {
        return res.status(400).json({ mensagem: 'Username e senha são obrigatórios.' });
    }

    try {
        const jaexiste = await User.findOne({ username });
        if (jaexiste) {
            return res.status(400).json({ mensagem: 'Usuário já existe!' });
        }

        const senhahash = await bcrypt.hash(senha, 10);
        const usuario = new User({ username, senha: senhahash });

        await usuario.save();
        return res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.error("Erro ao salvar usuário:", error); // Log do erro
        return res.status(500).json({ mensagem: 'Erro ao criar usuário', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, senha } = req.body

    const user = await User.findOne({ username })
    if (!user) {
        return res.status(400).json({ mensagem: 'Usuario ou senha invalidos!'})
    }

    const certo = await bcrypt.compare(senha, user.senha)
    if (!certo) {
        return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
    }
        const token = jwt.sign({username: user.username}, process.env.JWT_SECRET, { expiresIn: '1h' })
        return res.json({ auth: true, token})
})

app.get('/clima/:cidade', verifyJWT, async (req, res) => {
console.log(req.userId + ' fez essa chamada') 
const { cidade } = req.params
    try {
        const resultado = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid={API_KEY}&units=metric`)
        res.status(200).send(resultado.data)
    } catch (error) {
        res.status(500).send(console.error(error));
    }
})

app.listen(3000, () => {
    console.log('Servidor rodando em https://localhost:3000')
})