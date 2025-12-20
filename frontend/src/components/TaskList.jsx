/*
import React, { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;   //vite prefix neccessary
*/


//REACT COMPONENET NAMES MUST START WITH A CAPITAL LETTER
import React,{useState} from "react";
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;

function TaskList({ tasks, refresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [prioritySort, setPrioritySort] = useState("none");

  // ----------------------------
  // 🔄 Update Task Status
  // ----------------------------
  /*
  async function updateStatus(id, status) {
    await fetch("/tasks/update", {
      method: "PUT",
      credentials: "include", // ⭐ REQUIRED for HttpOnly cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    refresh();
  }
*/

//state boolean but we use ternary to make it string
  async function updateStatus(id,status){
    await fetch("/tasks/update",{
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      method:"PUT",
      body: JSON.stringify({id,status})
    });

    refresh();
  }





  // ----------------------------
  // 🗑 Delete Task
  // ----------------------------
  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    await fetch("/tasks/delete", {
      method: "DELETE",
      credentials: "include", // ⭐ send cookie for auth
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    refresh();
  }




  /*
  //Upload Files
  async function uploadFile(taskId, file) {
    const formData = new FormData();
    formData.append("attachment", file);

    const res = await fetch(`/tasks/attachments/${taskId}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
    refresh();
  }
  */


  async function uploadFile(taskId,file){
    const formdata=new FormData();
    formdata.append("attachment",file);  //field name mismatch means backend has diff name

    const data=await fetch(`/tasks/attachments/${taskId}`,{
      method:"POST",
      credentials:"include",
      body:formdata
    });
    const res=await data.json();
    
    alert(res.message);
    refresh();
  }


/*

//formdata builds a multipart/form-data request 
//"attachment" must match backend field name,eg multer.single("attachment")
//no manual headers.. like content type, breaks upload
//multipart/form-data is an http request format +form fields together
//normal json , cant send files
//request looks like---
// POST /upload
// Content-Type: multipart/form-data; boundary=----123

// ------123
// Content-Disposition: form-data; name="attachment"; filename="img.png"
// Content-Type: image/png

// (binary file bytes here)
// ------123--

//file is a browser File object
// file.name        // "photo.png"
// file.type        // "image/png"
// file.size        // 24567 (bytes)
// file.lastModified

// Internally:

// Raw binary data

// Not readable as text

// Meant to be streamed

// You usually get it from:

// <input type="file" />


// or drag & drop.

//append --- add a new part to multipart request
// append(field name, file content)
// equivalent to 
// <input type="file" name="attachment" />
// on backend
// upload.single("attachment")
// name must match

// 5️⃣ Why NOT JSON for files?

// ❌ JSON:

// Text-only

// Base64 encoding → 33% bigger

// Memory-heavy

// ✅ multipart:

// Binary

// Streamed

// Efficient

// Industry standard


// Why you don’t set Content-Type manually

// Browser automatically sets:

// Content-Type: multipart/form-data; boundary=...


// If you set it yourself:
// ❌ boundary missing
// ❌ multer fails

*/











/*
  // ----------------------------
  // 🧠 Search + Filter Logic
  // ----------------------------
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || t.status === statusFilter;

    return matchesSearch && matchesStatus;  //true then shown in list
  });
//filters as soon as we type.
*/
//keep a task only if the callback returns true
//returns new arraay, 
//includes means if searchterm is bug then it can amtch --fix a bug
//if user selected all -- every task passes
//otherwise the statusfilter status tasks only
//at last task shown  matches status or searthtext

  const filteredTasks=tasks.filter((t)=>{
    const matchesSearch=t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.description??" ").toLowerCase().includes(searchTerm.toLowerCase());
    const statussearch=statusFilter==="All" || t.status==statusFilter;
    return matchesSearch && statussearch;
  });

//arrays are objects internally
///object spread {...obj}
///arr spread [...arr]
//saem for destruction-- { name, role} =obj
//[ first,second]=arr but order matter unlike object


  // ------- PRIORITY SORT ORDER -------
  const priorityRank = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1
  };



  //spread emans --take something apart and copy its contents
  //its copy , original not modified, if used a=b instead of a=...b then not copy
  //spread is not a deep copy, its a shallow copy, as inner objects stil references
//   const a = { x: 1 };
// const b = { ...a, x: 2 };//b.x is 2

// const a = { user: { name: "Jit" } };
// const b = { ...a };

// b.user.name = "Changed";

// console.log(a.user.name); // "Changed" ❌

// .sort() mechanics (CORE JS)
// array.sort((a, b) => NUMBER);

// Rules of .sort():
// Return value	Meaning
// < 0	a comes before b
// > 0	b comes before a
// 0	no change



  // ------- SORT BY PRIORITY -------
  let sortedTasks = [...filteredTasks];

  if (prioritySort === "high-to-low") {
    sortedTasks.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
  } else if (prioritySort === "low-to-high") {
    sortedTasks.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  }


/*w-full dont work if parent has no width like span so nothing to fill
fix by using block, */



  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Task List</h2>

      {/* 🔍 Search + Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
       
{/*         
         <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
        /> 
         */}

          <input type="text" placeholder="search tasks.." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="px-2 py-3 rounded-2xl border border-orange-800 transition-all duration-300 ease-out focus:shadow-lg focus:ring-2 focus:ring-blue-800 w-full"/>





        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
        >
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>

        <select
          value={prioritySort}
          onChange={(e) => setPrioritySort(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
        >
          <option value="none">Sort By Priority</option>
          <option value="high-to-low">High → Low</option>
          <option value="low-to-high">Low → High</option>
        </select>

      </div>

      {/* ========================== */}
      {/* 📝 Task Cards */}
      {/* ========================== */}

    {/* new Date(t.deadline).toLocaleDateString("en-GB")
It converts a date value into a human-readable string formatted in British date format */}
{/* 1️⃣ new Date(t.deadline)

Creates a JavaScript Date object

t.deadline is usually:

ISO string → "2025-12-20T00:00:00.000Z"

Date string → "2025-12-20"

Timestamp → 1703030400000

📌 JS internally stores dates as milliseconds since Jan 1, 1970 (UTC).

2️⃣ .toLocaleDateString("en-GB")

Formats the date based on locale

"en-GB" → UK format

 */}





      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">
            No tasks match your search.
          </p>
        ) : (
          sortedTasks.map((t) => {
            const deadline = t.deadline
              ? new Date(t.deadline).toLocaleDateString("en-GB")
              : "No deadline";

            const isDone = t.status === "done";  

{/* do map if element present ie length is not zero,  always check brackets and sorted.length use {} immediately
sorted.length not length() like cpp */}

          {/* <div className="space-y-4">
            {sortedTasks.length===0?(
                <p className="text-center">No tasks</p>
              ):(
                sortedTasks.map((t)=>{
                  const deadline=t.deadline?new Date(t.deadline).toLocaleDateString("en-GB"):"No deadline";
                  const isDone=t.status==="done";  */}
                
                
              
            
// we check if t.priority is null , then add "" so that it dont crash , then we trim as if the gap is high then also problem, then lowercase for better match
//t.any??""---if null set it to ""
//use inside classname = {` `}.....see brackets bruh { ` ${} `}... bruh use " " for tailwind css styles names
            
          return (
              <div
                key={t.id}
                className={`p-5 bg-white rounded-2xl shadow-md  hover:shadow-lg transition-all
                  border-l-8 
                  ${
                    ((t.priority ?? "") + "").trim().toLowerCase() === "urgent"
                      ? "border-red-600"
                      : ((t.priority ?? "") + "").trim().toLowerCase() === "high"
                      ? "border-orange-500"
                      : ((t.priority ?? "") + "").trim().toLowerCase() === "medium"
                      ? "border-blue-600"
                      : "border-gray-400"
                  }`}
              >

          {/* // return(
          //     <div key={t.id}
          //     className={`shadow-lg border-l-8 p-4 rounded-xl
          //     ${((t.priority??"")+" ").trim().toLowerCase()==="urgent"?
          //       "border-red-600" 
          //       : ((t.priority??"")+" ").trim().toLowerCase()==="medium"?
          //       "border-blue-700"
          //       : ((t.priority??"")+"").trim().toLowerCase()==="high"?
          //       "border-orange-400":"border.grey-900"
          //     }`}
          //     > */}


{/* 
In flexbox, this is the default behavior:

Flex items have min-width: auto

That means:

The item refuses to shrink smaller than its content

Long text overflows, breaks layout, or ignores truncate

truncate/break-words won't work 

flex-wrap controls whether flex items stay on one line or wrap onto multiple lines when there isn’t enough space.*/}

{/* its items-start see 's' , not item-- without this browser falls to default alignment and causes extra vertical spacing */}

                <div className="flex flex-col gap-4">

                  {/* ✅ TITLE + PRIORITY */}
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-800  break-words ">
                        {t.title}
                      </h3>
                      <p className="text-sm text-gray-600 break-words mt-1">
                        {t.description}
                      </p>
                    </div>


{/* 
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg break-words">{t.title}</h3>
                        <p className>{t.description}</p>
                      </div> */}

                    <span
                      className={`shrink-0 ml-auto px-3 py-1 text-xs font-bold rounded-full text-white ${
                        t.priority === "urgent"
                          ? "bg-red-600"
                          : t.priority === "high"
                          ? "bg-orange-500"
                          : t.priority === "medium"
                          ? "bg-blue-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {t.priority.toUpperCase()}
                    </span>
                  </div>

                  {/* ✅ META INFO */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span><b>Assigned:</b> {t.assigned_to || "N/A"}</span>
                    <span><b>Deadline:</b> {deadline}</span>

                    <span
                      className={`px-2 py-1 rounded-md text-white ${
                        isDone ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {isDone ? "Completed" : "Pending"}
                    </span>
                  </div>

{/* if null attachments or undefined then stop or no attachments
then only return the div, flex-wrap is to move to next row if space runs out, 

file.file_type is a MIME type so image/png starts with images */}



                  {/* ✅ ATTACHMENTS */}
                  {t.attachments && t.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {t.attachments.map((file) => (
                        <div key={file.id} className="flex items-center gap-2">

                          {file.file_type.startsWith("image") && (
                            <div className="flex flex-col items-center gap-1">

                              {/* ✅ IMAGE PREVIEW IN SAME TAB */}
                              {/* shows a 20x20 thumbnail object-cover helps maintain aspect ratio, then cursor-pointers changes cursor to hand
                              on clicking- opens full image in new tab as we used _blank

                              for download link , we applied style to download word inside a tags, 
                              its downloaded via backend, so thats authentication and authorization is checked

                              in src, browser sends get request to this url in backend, and server gives it
                              <img> dont start on new line , sits between words, inline replace element

                              window.open(url,target) , we use a tags also , hover changes size of image

                              //<img> align to text baseline, not bottom */}

                              <img
                                src={`${BACKEND_URL}/${file.file_path}`}
                                className="h-20 w-20 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                                alt={file.file_name}
                                onClick={() => window.open(`${BACKEND_URL}/${file.file_path}`,"_blank")}
                              />

                              {/* ✅ DOWNLOAD IMAGE */}
                              <a
                                href={`${BACKEND_URL}/tasks/download/${file.id}`}
                                className="text-xs text-blue-600 underline"
                              >
                                ⬇ Download
                              </a>


                            </div>
                          )}


                          {file.file_type === "application/pdf" && (
                            <div className="flex flex-col items-center gap-1">

                              {/* ✅ OPEN PDF IN NEW TAB */}
                              {/* we navigate to backend url ,on clicking browser sends get request

                              dont link direct to File

                              noopner noreferrer exists as opened page can redirect ur site, steal data, perform phishing attack
                              noopener---prevents new tabs from accessing window.opener 
                              noreferrer--hides page url from opened site,prevents sending Referer header */}


                              <a
                                href={`${BACKEND_URL}/${file.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded-md"
                              >
                                📄 Open PDF
                              </a>

                              {/* we are forcing download here, browser just knows to display but we need to make it force download,
                              i clicked and it was taking me to preview everytime so add force download
                              we could use <a href="file.pdf" download>but its bad for protected files */}

                              {/* ✅ DOWNLOAD PDF */}
                              <a
                                href={`${BACKEND_URL}/tasks/download/${file.id}`}
                                className="text-xs text-blue-600 underline"
                              >
                                ⬇ Download
                              </a>


                            </div>
                          )}


                        </div>
                      ))}
                    </div>
                  )}

                  {/* ✅ FILE UPLOAD */}
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 text-sm bg-gray-100 rounded-lg cursor-pointer border hover:bg-gray-200">
                      📎 Upload
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        hidden
                        onChange={(e) => uploadFile(t.id, e.target.files[0])}
                      />
                    </label>
                  </div>

                  {/* ✅ ACTION BUTTONS */}
                  <div className="flex gap-3 pt-2">

                    <button
                      onClick={() =>
                        updateStatus(
                          t.id,
                          isDone ? "pending" : "done"
                        )
                      }
                      className={`px-4 py-2 text-sm rounded-lg font-medium text-white shadow ${
                        isDone
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isDone ? "Mark Pending" : "Mark Done"}
                    </button>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="px-4 py-2 text-sm rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white shadow"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            );

          })
        )}
      </div>
    </div>
  );
}

export default TaskList;





// MIME type (Multipurpose Internet Mail Extensions) tells the browser what kind of data is being sent and how it should be handled.

// In short:

// “What is this file/data?”

// 2️⃣ Basic format
// type/subtype


// Examples:

// text/html

// application/json

// image/png

// multipart/form-data

// 3️⃣ Why MIME type is needed

// Browsers do not guess reliably.

// They use MIME type to decide:

// Render it

// Download it

// Execute it

// Parse it

// 📌 Same file content + wrong MIME type = wrong behavior.










// Implicit return (works)
// items.map(item => (
//   <div>{item}</div>
// ))

// Explicit return (works)
// items.map(item => {
//   return <div>{item}</div>;
// })




// Map
// Use when:

// Keys can be any type (object, function, number)

// Frequent add/remove/lookups

// Need guaranteed insertion order

// const map = new Map();
// map.set({ id: 1 }, "task");

// [] (Array)

// Use when:

// Order matters

// Duplicates allowed

// Index-based access

// const tags = ["bug", "urgent", "bug"];

// Set

// Use when:

// Uniqueness matters

// Fast membership checks

// const tags = new Set(["bug", "urgent", "bug"]);
// // → {"bug", "urgent"}


// 3️⃣ Why JSON enforces {} and []

// JSON allows ONLY:

// Objects {} → key/value

// Arrays [] → ordered values

// ❌ No Map, Set, Date, Function, undefined





// let a = 10;
// let b = a;
// Picture:

// css
// Copy code
// a ──▶ 10
// b ──▶ 10
// They are separate values.
// Changing b does NOT affect a.


// Objects & arrays are DIFFERENT
// const user = { name: "Jit" };
// const copy = user;


// Picture:

// user ─┐
//       ├─▶ { name: "Jit" }
// copy ─┘


// 👉 Both variables point to the same box


// Create a new outer box, but reuse inner boxes

// const user = {
//   name: "Jit",
//   address: { city: "Delhi" }
// };

// const copy = { ...user };


// Picture:

// copy ──▶ { name: "Jit", address ─┐ }
//                                 ├─▶ { city: "Delhi" }
// user ────────────────────────────┘

// Key idea

// user and copy are different objects

// BUT address inside both is the same object


// Deep copy means:

// Every nested box is also copied



