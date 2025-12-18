import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

// Start the server only after DB connection is established
// connectDB() method returns a promise which we can use to start the server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

// (async () => {
//     try {
//         app.listen(process.env.PORT || 8080, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error('Server failed to start:', error);
//         process.exit(1);
//     }
// })()
