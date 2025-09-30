require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/db/db")
connectDB()

app.listen(process.env.PORT, console.log(`server is Runing at Port ${process.env.PORT}`))