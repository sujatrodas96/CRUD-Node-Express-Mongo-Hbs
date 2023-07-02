const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/employeregistration?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0", {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("connection sucessful...."))
.catch((err) => console.log(err));