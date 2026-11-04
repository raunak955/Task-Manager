const express =  require("express");
const cors = require("cors");
const connetDB = require("./config/db");
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")
require("dotenv").config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes);

//Test api
app.get("/", (req,res) =>{
  req.send("Task manager backend is running ")
});

// server
const PORT = process.env.PORT || 5000;

// start server
const startServer = async () =>{
  try {
    await connetDB();

    app.listen(PORT, () =>{
  console.log(`server running on port ${PORT}`)
})
  } catch (error) {
    console.log("server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();