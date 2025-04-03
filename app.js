const express = require("express");
const fileupload = require("express-fileupload");
const mongoose = require("mongoose")
const cookieparser = require("cookie-parser")
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const accountrouter = require("./routers/authrouter")
const allrouter = require('./routers/generalrouter')
const userprofile = require("./routers/profilerouter")
const app = express();

const port = process.env.PORT;
app.use('/public', express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser())
app.use(cors());
app.use(fileupload());
const mydata = process.env.MONGO_URL
mongoose.connect(mydata).then(() => {
    console.log("connected to the database")
}).catch(err => { console.log(err) })

// router middleware
app.get("/", (req, res) => {
    res.status(200).json({ message: "THIS IS MY API PROJECT" });
});

app.use("/api", accountrouter);
app.use("/api", allrouter)
app.use("/api", userprofile)

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
    console.log("running on port" + port)
})
