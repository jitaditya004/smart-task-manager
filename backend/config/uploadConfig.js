
/*


const multer = require("multer");
//it configures multer to handle file uploads files
//on disk inside uploads tasks with unique filename
const path = require("path");


//below tells multer to store files on disk
//alternative meorystorage --- stores in ram
//file--metadata about uploaded file
//cb(error,destination path)
//null means no error
//filename: -- how file is named
//needed to prevent filename collision

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/tasks/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
//above createsa middlewire to use
// upload.single("file")
// upload.array("files", 5)


module.exports = upload;


// Multer is Express middleware for handling multipart/form-data

// Mainly used for file uploads

// Parses incoming request and attaches files to req.file / req.files


*/



const multer= require("multer");
const path=require("path");


const storage=multer.diskStorage({
   destination: (req,file,cb)=>{
        cb(null,"./uploads/tasks");
    },
    filename:(req,file,cb)=>{
      cb(null,Date.now()+"-"+file.originalname);
    }
  }
)

//destination path is relative to process.cwd
//changes depeding on where node is started
//



const upload=multer({ storage });

module.exports=upload;


//add file type validation
/////dont use original name



// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../uploads"));
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const safeName = path.basename(file.originalname, ext);
//     cb(null, `${Date.now()}-${safeName}${ext}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only images allowed"));
//     }
//     cb(null, true);
//   }
// });

// module.exports = upload;



//path relative to node process working directory
//not relative to this config file