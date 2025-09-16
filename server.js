const express= require("express");
const bodyparser= require("body-parser");
const mysql= require("mysql2");
const path= require("path");

const app= express();
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname,"public"))); //good practise
//public is a folder

//db connection
const db=mysql.createConnection({
   host : "localhost",
   user : "root",
   password : "",
   database : "task_manager" 
});

db.connect(err => {
    if(err) throw err; //stops the server , if not connected
    console.log("✅ MYSQL CONNECTED");
});

//routes

///get all tasks, backticks by the way
//left join ,,takes all rows from left table ,matches with right table, if no match, still include left table row but put null for right table row
app.get("/tasks", (req,res) =>{
    const query=`select t.id, t.title, t.description, t.status, u.username as assigned_to, t.deadline
    from tasks t left join users u on t.assigned_to = u.id
    order by t.created_at desc`;
    db.query(query,(err,results)=>{
        if(err) {
            console.error("error fetching tasks:",err); //logs error in server console
            return res.status(500).json({ success:false,error: "failed to fetch tasks" });
        }
        res.json(results);
    });
});

// Add new user
//added new if-err so server dont crash when an eror occurs
app.post("/addUser", (req, res) => {
    const { username, password } = req.body;
    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(query, [username, password], (err) => {
        if (err) {
            console.error("add user error:",err);

            if(err.code==="ER_DUP_ENTRY"){
                return res.status(400).json({ success:false, message:"username already exists!!"});

            }
            return res.status(500).json({ success:false,error:err.message });
        }
        res.json({ success: true,message: "user added successfully" });
    });
});

// Add new team
app.post("/addTeam", (req, res) => {
    const { name } = req.body;
    const query = "INSERT INTO teams (name) VALUES (?)";
    db.query(query, [name], (err) => {
        if (err) {
            console.error("Add Team Error:", err);

            // if team name is unique and already exists, MySQL throws ER_DUP_ENTRY
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ success: false, message: "Team name already exists!" });
            }

            return res.status(500).json({ success: false, error: "Failed to add team" });
        }
        res.json({ success: true,message: "team added successfully" });
    });
});




//add task
app.post("/add", (req,res) =>{
    const { title,description,assigned_to,team_id,deadline } =req.body;
    const query="insert into tasks (title,description,assigned_to,team_id,deadline) values (?,?,?,?,?)";
    db.query(query, [title,description,assigned_to,team_id,deadline],(err)=>{
        if (err) {
            console.error("Add Task Error:", err);
            return res.status(500).json({ error: "Failed to add task" });
        }
        res.json({ success: true, message: "Task added successfully" });
        //gap between success and true
    });
});



//update tasks
app.post("/update",(req,res)=>{
    const {id,status} = req.body;
    db.query("update tasks set status=? where id=?",[status,id],(err)=>{
        if (err) {
            console.error("Update Task Error:", err);
            return res.status(500).json({ error: "Failed to update task" });
        }
        res.json({ success: true, message: "Task updated successfully" });
    });
});

//delete task 
app.post("/delete",(req,res)=>{
    const {id}=req.body;
    db.query("delete from tasks where id=?",[id],(err)=>{
        if (err) {
            console.error("Delete Task Error:", err);
            return res.status(500).json({ error: "Failed to delete task" });
        }
        res.json({ success: true, message: "Task deleted successfully" });
    });
});

//route to get all user name
app.get("/users",(req,res)=>{
    const query="select id,username from users order by id asc";
    db.query(query,(err,results)=>{
        if(err){
            console.error("fetch users error: ",err);
            return res.status(500).json({sucess:false,error:err.message });
        }
        res.json(results);
    
    });
});


// Get all teams
app.get("/teams", (req, res) => {
    const query = "SELECT id, name FROM teams ORDER BY id ASC";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Fetch Teams Error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(results);
    });
});






//starting server
const PORT=3000;
app.listen(PORT,()=>console.log(`server running at http://localhost:${PORT}`));



//backticks not double quotes
//throw err, crashes website on error