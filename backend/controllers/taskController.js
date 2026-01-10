// backend/controllers/taskController.js
const db = require("../config/db");

// 🧠 GET TASKS (WITH ATTACHMENTS FIX)
exports.getTasks = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query, params;

    if (role === "admin") {
      query = `
        SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.priority,
          t.deadline,
          u.username AS assigned_to,

          COALESCE(
            json_agg(
              json_build_object(
                'id', a.id,
                'file_path', a.file_path,
                'file_name', a.file_name,
                'file_type', a.file_type
              )
            ) FILTER (WHERE a.id IS NOT NULL),
            '[]'
          ) AS attachments

        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN task_attachments a ON a.task_id = t.id

        GROUP BY t.id, u.username
        ORDER BY t.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.priority,
          t.deadline,
          u.username AS assigned_to,

          COALESCE(
            json_agg(
              json_build_object(
                'id', a.id,
                'file_path', a.file_path,
                'file_name', a.file_name,
                'file_type', a.file_type
              )
            ) FILTER (WHERE a.id IS NOT NULL),
            '[]'
          ) AS attachments

        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN task_attachments a ON a.task_id = t.id

        WHERE t.assigned_to = $1 OR t.created_by = $2
        GROUP BY t.id, u.username
        ORDER BY t.created_at DESC
      `;
      params = [id, id];
    }

    const { rows } = await db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
};





// 🧠 ADD TASK
exports.addTask = async (req, res) => {
  try {
    const { title, description, assigned_to, team_id, deadline, priority } = req.body;
    const { id } = req.user;

    // If no team_id → personal task
    const isPersonal = !team_id;
    const finalAssignedTo = isPersonal ? id : assigned_to;

    const query = `
      INSERT INTO tasks (title, description, assigned_to, team_id, deadline, created_by, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await db.query(query, [
      title,
      description,
      finalAssignedTo,
      team_id || null, 
      deadline,
      id,
      priority || "medium"
    ]);

    res.json({
      success: true,
      message: isPersonal
        ? "✅ Personal task added successfully"
        : "✅ Team task added successfully",
    });
  } catch (err) {
    console.error("❌ Add Task Error:", err);
    res.status(500).json({ error: "Failed to add task" });
  }
};


//add tasks
/*
exports.addTask=async (req,res)=>{
  const {title, description, assigned_to, team_id, deadline, priority}=req.body;
  const {id}=req.user;

  const ispersonal=!team_id;
  const finalassignedto=ispersonal?id:assigned_to;

  const query=`insert into tasks (title,description,assigned_to,created_by,team_id,deadline,priority)
                values ($1,$2,$3,$4,$5,$6,$7)`
  
  try{
      await db.query(query,[
        title,description,finalassignedto,id,team_id || null,deadline,priority||"medium"
      ]);       
      
      res.json({
        success: true,
        message: ispersonal? "personal task created":"tem task created"
      });
    }catch(err){
      console.error(err);
      res.status(500).json({message:"error"});
    }

}
*/
//inside res.json i forgot comma, no semicolon
//use camel case
//if (team_id && !assigned_to) {
//   return res.status(400).json({ message: "assigned_to is required for team tasks" });
// }





// 🧠 UPDATE TASK

exports.updateTask = async (req, res) => {
  try {
    const { id: taskId, status } = req.body;
    const { id, role } = req.user;

    let query, params;

    if (role === "admin") {
      query = "UPDATE tasks SET status=$1 WHERE id=$2";
      params = [status, taskId];
    } else {
      query =
        "UPDATE tasks SET status=$1 WHERE id=$2 AND (assigned_to=$3 OR created_by=$4)";
      params = [status, taskId, id, id];
    }

    const result = await db.query(query, params);

    if (result.rowCount === 0)
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });

    res.json({ success: true, message: "✅ Task updated successfully" });
  } catch (err) {
    console.error("❌ Update Task Error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

//"UPDATE tasks SET status=$1 WHERE id=$2 AND (assigned_to=$3 OR created_by=$4)
//UPDATE tasks SET status=$1 WHERE id=$2


// exports.updateTasks=async(req,res)=>{
//   const {id:taskId,status}=req.body;
//   const{id,role} =req.user;

//   let query='';  //use let not const
//   let params='';

//   if(role==="admin"){
//     // const query=`update tasks set status=$1 where id=$2`;
//     // const params=[taskId,status];   
//     //if u define both of them here then obviously it will be block scoped
//     query=`update tasks set status=$1 where id=$2`;
//     params=[status,taskId]; 
//     //always check order
//   }else{
//     query=`update tasks set status=$1 where id=$2 and (assigned_to=$3 or created_by=$4)`;
//     params=[status,taskId,id,id];
//   }
//   try{
//     const result=await db.query(query,params);

//     if(result.rowCount===0){   //its rowCount
//       return res.status(403).json({message:"unauthoorized"});
//     }

//     res.json({message:"sucess",success:true});//success response, add success true
//   }catch(err){
//     console.error(err);
//     res.status(500).json({message:"server error"});
//   }
// }








// 🧠 DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.body;
    const { id, role } = req.user;

    let query, params;

    if (role === "admin") {
      query = "DELETE FROM tasks WHERE id=$1";
      params = [taskId];
    } else {
      query =
        "DELETE FROM tasks WHERE id=$1 AND (assigned_to=$2 OR created_by=$3)";
      params = [taskId, id, id];
    }

    const result = await db.query(query, params);

    if (result.rowCount === 0)
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this task" });

    res.json({ success: true, message: "✅ Task deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Task Error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};


// TASK ATTACHMENTS

exports.uploadAttachment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    await db.query(
      `INSERT INTO task_attachments (task_id, file_path, file_name, file_type)
       VALUES ($1, $2, $3, $4)`,
      [taskId, file.path, file.originalname, file.mimetype]
    );

    res.json({ success: true, message: "File uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload attachment" });
  }
};

exports.getAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { rows } = await db.query(
      `SELECT id, file_path, file_name, file_type, uploaded_at 
       FROM task_attachments 
       WHERE task_id = $1`,
      [taskId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attachments" });
  }
};


const path = require("path");
//used to safely build paths
//prevent os issue / vs \
//preventts path traversal bugs
//nver concatenate paths manually for files

exports.downloadAttachment = async (req, res) => {
  try {
    const { fileId } = req.params;

    const { rows } = await db.query(
      `SELECT file_path, file_name FROM task_attachments WHERE id = $1`,
      [fileId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "..", rows[0].file_path);
    //just wrote-- --dirname-- is current controller folder
    //..  -- get out
    //then relative path from db
    //path.join works cross-platform
    const fileName = rows[0].file_name;

    res.download(filePath, fileName);
    //it does internally
    //Content-Disposition: attachment; filename="fileName"
    //streams file to client
    //browser must downlaod not preview
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to download file" });
  }
};
