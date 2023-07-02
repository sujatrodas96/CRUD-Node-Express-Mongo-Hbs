const express = require('express');
const app = express();

const path = require("path");
const hbs = require("hbs");
const port = process.env.PORT || 3000;
const bcrypt = require("bcryptjs");

//conneecting db
require('./db/conn.js');

//connecting model
const Register = require("./models/registration");

//for increament in user page
hbs.registerHelper('increment', function(index) {
    return index + 1;
  });

  //for gender
  hbs.registerHelper('ifEqual', function (val1, val2, options) {
    return val1 === val2 ? options.fn(this) : options.inverse(this);
  });

//connecting path of hbs
const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");

app.use(express.json());
//return as object
app.use(express.urlencoded({extended:false}));

//initialize view engine in public folder
app.use(express.static(staticpath));
app.set("view engine", "hbs");

//initialize new template folder
app.set("views", templatepath);

//initialize partials
hbs.registerPartials(partialpath);

app.get('/', (req, res) => {
    res.render("index");
})
app.get('/register', (req, res) => {
    res.render("register.hbs");
})
//creat a new user in our database
app.post('/registration', async (req, res) => {
    try
    {
        const password = req.body.password;
        const cpass = req.body.confirmpassword;
        if(password === cpass)
        {
            const Registeremployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword

            });

            console.log("the success part" + Registeremployee);

            //concept of middleware
            const token = await Registeremployee.generatetoken();
            console.log("the token part is : " + token);


            const registered = await Registeremployee.save();
            res.status(201).render("index.hbs");
        }
        else 
        {
            console.log("Password are not matching");
        }
    }
    catch(error)
    {
        res.status(400).send(error);
    }
})
app.get('/login', (req, res) => {
    res.render("login.hbs");
})

app.post('/user', async(req, res) => {
    try
    {
        
        const email = req.body.email;
        const password = req.body.password;
        const usermail = await Register.findOne({email:email});
        const visits = await Register.find({email:email});

        //compare login password and db password are same
        const ismatch = await bcrypt.compare(password, usermail.password);

        if(ismatch && visits.length > 0)
        {
            res.render("user", { list: visits });
        }else{
            res.send('Invalid email or password');
        }

    }
    catch(error)
    {
        res.status(400).send(error);
    }
})

app.get("/user/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const doc = await Register.findById(_id);

    if (doc) {
      res.status(201).render("user", { list: doc });
    } else {
      res.render("index");
    }
  } catch (err) {
    console.log("Cannot able to edit");
  }
});


app.get("/alluser", async (req, res) => {
    try {
      const visits = await Register.find();
  
      if (visits.length > 0) {
        res.render("user", { list: visits });
      } else {
        res.status(201).render("index");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  });

// for update
app.get("/edit/:id", async (req, res) => {
  try {
    const doc = await Register.findById(req.params.id);
    res.render("useredit", { doc: doc });
  } catch (err) {
    console.log("Cannot able to edit");
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const doc = await Register.findByIdAndUpdate(req.params.id);
    // Update the document with the data from req.body
    doc.firstname = req.body.firstname;
    doc.lastname = req.body.lastname;
    doc.email = req.body.email;
    doc.gender = req.body.gender;
    doc.phone = req.body.phone;
    doc.age = req.body.age; 
    // ... update other fields as needed

    const updatedDoc = await doc.save();
    res.redirect("/user/" + updatedDoc._id);
    res.status(201).render("user");
  } catch (err) {
    console.log("Cannot able to edit");
  }
});


  

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})