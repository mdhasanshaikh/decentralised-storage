const express = require("express");
const app = express();
const fs = require("fs");

const cors = require("cors");
app.use(cors());
// Pdf route that will serve pdf
// app.get("/files/pdf", (req, res) => {
//   var file = fs.createReadStream("./files/sample.txt");
//   file.pipe(res);
// });

app.use("/api/files/ipfs", require("./routes/api/ipfsConfig"));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server listining on port ", port);
});
