import "dotenv/config.js";
import { app } from "./src/app.js";
import { connectDB } from "./src/db/db.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("App is running on port ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
