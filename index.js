const app = require("./server");
require("dotenv").config();

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend executando...");
});