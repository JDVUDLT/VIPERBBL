
const express = require("express")
const server = express()
const multer  = require("multer")
const fs = require("fs-extra")
const cors = require("cors")
const path = require("path")
server.use(cors())
server.listen(3000)
server.use(express.json())
server.use(express.static(__dirname + "/public"))
server.use(express.static(__dirname + "/uploads"))
server.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
server.get("/registration", (req, res) => {
    res.sendFile(__dirname + "/registration.html")
})
server.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html")
})
server.get("/profile/customer", (req, res) => {
    res.sendFile(__dirname + "/profile.html")
})
server.get("/profile/shop", (req, res) => {
    res.sendFile(__dirname + "/profile2.html")
})
server.get("/login/admin", (req, res) => {
    res.sendFile(__dirname + "/loginadmin.html")
    let tokenadmin =
        { token: Date.now().toString(36) + Math.random().toString(36)
        }

    console.log(tokenadmin.token)
    fs.writeFileSync("Tokens.json", JSON.stringify(tokenadmin, null, 4))
})
server.get("/panel/admin", (req, res) => {

    res.sendFile(__dirname + "/Adminpanel.html")
})
server.get("/profile/shop/editor", (req, res) => {
    res.sendFile(__dirname + "/productseditor.html")
})
server.post("/sendDataRegistration", (req, res) => {
        let users = fs.readJSONSync("Users.json")
        let login = req.body
        function getUserbyLogin(log) {
            return users.filter(
                function(users){ return users.log == log }
            )
          }
        let userlog = getUserbyLogin(login.log)
        if(userlog[0] === undefined){
        users.push(login)   
        fs.writeFileSync("Users.json", JSON.stringify(users, null, 4))
        res.json({
            "user": req.body
        })
    }
        else{
            res.json({
                "msg": "Такой пользователь существует"
            })
        }
    
    }
)
server.post("/sendDataLogin", (req, res) => {
        let login = req.body
        let users = fs.readJSONSync("Users.json")
        function getUserbyLogin(log) {
            return users.filter(
                function(users){ return users.log == log }
            )
          }
        function getUserbyPass(pass) {
            return users.filter(
                function(users){ return users.pass == pass }
            )
          }
        let userlog = getUserbyLogin(login.log)
        let userpass = getUserbyPass(login.pass)
        if(userlog[0].log === login.log && userpass[0].pass === login.pass){
            res.send({
                msg: "Вы успешно вошли",
                user: userlog[0]
        })
        }
        else{
            res.send({
                msg: "Вы ввели неправильный логин или пароль"
        })
        }

})
server.post("/sendDataLoginAdmin", (req, res) => {
    let login = req.body
    let admins = fs.readJSONSync("Admin.json")
    function getUserbyLogin(log) {
        return admins.filter(
            function(admins){ return admins.log == log }
        )
      }
    function getUserbyPass(pass) {
        return admins.filter(
            function(admins){ return admins.pass == pass }
        )
      }
    let adminlog = getUserbyLogin(login.log)
    let adminpass = getUserbyPass(login.pass)
    let admintoken = fs.readJSONSync("Tokens.json")
    console.log(admintoken.token)
    if(adminlog[0].log === login.log && adminpass[0].pass === login.pass && admintoken.token === login.token){
        res.send({
            msg: "Вы успешно вошли",
            admin: adminlog[0]            
    })
    fs.removeSync("Tokens.json")
    }
    else{
        res.send({
            msg: "Вы ввели неправильный логин, пароль или токен"
    })
    }

})
server.post("/sendDataProduct", (req, res) => {
    let products = fs.readJSONSync("Products.json")
    let Product = req.body
    function getProductsbyName(name) {
        return products.filter(
            function(products){ return products.name == name }
        )
      }
    let productname = getProductsbyName(Product.name)
    if(productname[0] === undefined){
    products.push(Product)   
    fs.writeFileSync("Products.json", JSON.stringify(products, null, 4))
    res.json({
        "product": req.body
    })
}
    else{
        res.json({
            "msg": "Такой товар уже существует"
        })
    }

}
)
const uploadDir = 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});
server.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не был загружен' });
    }
    
    res.json({
      success: true,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    })
  } catch (err) {
    console.error('Ошибка загрузки:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
server.post("/sendDataUsers", (req, res) => {
    let userslist = fs.readJSONSync("Users.json")
    let msg = req.body
    if(msg.msg == "Список Пользователей"){
        res.json({
            userslist: userslist
        }
        )
    }
})
server.post("/sendDataProducts", (req, res) => {
    let productslist = fs.readJSONSync("Products.json")
    let msg = req.body
    if(msg.msg == "Список товаров"){
        res.json({
            productslist: productslist
        }
        )
    }
})
server.post("/sendDataDeleteUser", (req, res) => {
    let deletelog = req.body
    let users = fs.readJSONSync("Users.json")
    function getUserbyLogin(log) {
        return users.filter(
            function(users){ return users.log == log }
        )
        }
        let userlog = getUserbyLogin(deletelog.els)
        if(userlog[0].log === deletelog.els){
            const usersdelete = userlog[0]
            const usersdel = users.filter((user) => user !== usersdelete)
            fs.writeFileSync("Users.json", JSON.stringify(usersdel, null, 4))
        } 
      
})
server.post("/sendDataDeleteProduct", (req, res) => {
    let Productname = req.body
    let products = fs.readJSONSync("Products.json")
    function getProductsbyName(name) {
        return products.filter(
            function(products){ return products.name == name }
        )
    }
    let productname = getProductsbyName(Productname.els)
    if(productname[0].name === Productname.els){
            const productdelete = productname[0]
            const productdel = products.filter((product) => product !== productdelete)
            fs.writeFileSync("Products.json", JSON.stringify(productdel, null, 4))
        } 
      
})
server.post("/sendDataProductsCards", (req, res) => {
    let productslist = fs.readJSONSync("Products.json")
    let msg = req.body
    if(msg.msg == "Показать товары"){
        res.json({
            productslist: productslist
        }
        )
    }
})

