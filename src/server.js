const express = require("express")
const server = express()

// Pegar o campo de dados
const db = require("./database/db")

// Configurar a pasta public
server.use(express.static("public"))

// Habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

// Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar caminhos da minha aplicação
// página inicial
server.get("/", (req,res) => {
    return res.render("index.html") /** tirei o src/views pois já está no nunjucks */
})

server.get("/create-point", (req,res) => {

    return res.render("create-point.html")
})  /** Renderizar é para passar pelo nunjucks e devolver o html puro */

server.post("/savepoint", (req,res) => {

  // req.body = o corpo do formulário
  // console.log(req.body)

  // Inserir dados no banco de dados
  const query = `
  INSERT INTO places (
    image,
    name,
    address,
    address2,
    state,
    city,
    items
  ) VALUES (?,?,?,?,?,?,?);
`
const values = [
  req.body.image,
  req.body.name,
  req.body.address,
  req.body.address2,
  req.body.state,
  req.body.city,
  req.body.items,
]

function afterInsertData(err) {
  if(err) {
    console.log(err) 
    return res.send("Erro no cadastro!")
  }
  console.log("Cadastrado com sucesso")
  console.log(this)

  return res.render("create-point.html", { saved: true })
}
  db.run(query, values, afterInsertData) 

})

server.get("/search", (req,res) => {

  const search = req.query.search

  if(search == "") {
    return res.render("search-results.html", {total: 0})
  }

    //Pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
    if(err) {
      return console.log(err)
    }

    const total = rows.length

    // Mostrar a página html com os bancos de dados
    return res.render("search-results.html", {places: rows, total: total})
  })

})  /** Renderizar é para passar pelo nunjucks e devolver o html puro */

// Ligar o servidor
server.listen(3000)

/** Depois que eu mando o index.html para o servidor, ele não consegue
 * ler os arquivos que estão no public, ai a página fica com a estilização
 * quebrada, por isso deve-se configurar a pasta public
 */

