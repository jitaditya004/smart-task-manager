
document.getElementById("addUserBtn").addEventListener("click",()=>{
    addUser(
        document.getElementById("new_username").value,
        document.getElementById("new_password").value
    );
});
//addUser is a functon btw



async function fetchtasks(){
    try{
    const res=await fetch("/tasks");
    const tasks=await res.json();
    const list=document.getElementById("tasklist");
    list.innerHTML="";

    tasks.forEach(t => {
        const li=document.createElement("li");
        li.textContent=`${t.id}. ${t.title} | ${t.description} | assigned: ${t.assigned_to || 'N/A'} | status: ${t.status} | deadline: ${t.deadline || 'N/A'}`;

        //status update buttons
        if(t.status != 'done'){
            const donebtn=document.createElement("button");
            donebtn.textContent="✅ done";
            donebtn.onclick=async () => {
                await fetch("/update", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ id: t.id, status: 'done' })

                });
                fetchtasks();
            };
            li.appendChild(donebtn);
        }
        
        const delbtn=document.createElement("button");
        delbtn.textContent="❌ delete";
        delbtn.onclick=async()=>{
            await fetch("/delete",{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ id: t.id})
                
            });
            fetchtasks();
        };
        li.appendChild(delbtn);

        list.appendChild(li)
    });
    }catch(err){
        console.error("add user error: ",err);
        alert("failed to add user!");
    }
}


async function addtask(){
    const title=document.getElementById("title").value;
    const description=document.getElementById("description").value;
    const assigned_to = document.getElementById("assigned_to").value || null;
    const team_id = document.getElementById("team_id").value || null;
    const deadline = document.getElementById("deadline").value || null;
    try{
    const res=await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ title,description,assigned_to,team_id,deadline})
  });

  const data=await res.json();
  if(res.ok){
    alert(data.message);
    fetchtasks();
  }else{
    alert(data.error);
  }
    }catch(err){
        console.error("add task error: ", err);
        alert("failed to add task!");
    }
  
}

//i m already passing username and password throught the fnction
async function addUser(username, password) {
    try{
        const res = await fetch("/addUser", {   
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data=await res.json();    //define res

        if(res.ok){
            alert(data.message); //user added successfully
            fetchUsers();//to refresh after adding users
        }else{
            alert(data.message || data.error);
        }
        
    }
    catch(err){
        console.error("fetch error",err);
        
    }
}



//dont forget to initialise res
async function addTeam(name) {
    try {
        const res = await fetch("/addTeam", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            fetchTeams();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error("Add Team Error:", err);
        alert("Failed to add team!");
    }
}


/*
async function fetchUsers(){
    try{
        const res=await fetch("/users");
        const users=await res.json();
        console.log("all users:",users);
    }catch(err){
        console.error("fetch users error:",err);
    }
}

async function fetchTeams() {
    try {
        const res = await fetch("/teams");
        const teams = await res.json();
        console.log("All Teams:", teams); // You can display them in the page
    } catch (err) {
        console.error("Fetch Teams Error:", err);
    }
}
*/


async function fetchUsers() {
    const res = await fetch("/users");
    const users = await res.json();

    const select = document.getElementById("assigned_to");
    select.innerHTML = ""; // clear previous options

    users.forEach(u => {
        const option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.username; // show username
        select.appendChild(option);
    });
}

async function fetchTeams() {
    const res = await fetch("/teams");
    const teams = await res.json();

    const select = document.getElementById("team_id");
    select.innerHTML = ""; // clear previous options

    teams.forEach(t => {
        const option = document.createElement("option");
        option.value = t.id;
        option.textContent = t.name; // show team name
        select.appendChild(option);
    });
}




document.addEventListener("DOMContentLoaded", () => {
    fetchtasks();   // existing task fetch
    fetchUsers();   // fetch all users
    fetchTeams();   // fetch all teams
});