import React, { useState } from "react";

function UserForm({ refresh }){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    async function addUser(){
        const res=await fetch("/users/addUser",{
            method:"POST",
            headers: { "Content-Type":"application/json"},
            body:JSON.stringify({ username,password }),
        });

        const data=await res.json();
        alert(data.message || data.error);
        if(res.ok){
            refresh();
            setUsername("");
            setPassword("");
        }
    }

    return (
        <div>
            <h2>Add User</h2>
            <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
            <button onClick={addUser}>Add User</button>
        </div>
    );
}


export default UserForm;
