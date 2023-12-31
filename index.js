var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
app.use(express.static("assets"));

var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});

var options = {
  base: "http://localhost:8081", // or use: req.protocol + '://' + req.get('host')
  format: "A4",
  orientation: "vertical",
  border: "0mm",
  header: {
    height: "100px",
    contents: '<div style="text-align: center;">Generacion Finiquito</div>',
  },
  footer: {
    height: "28mm",
    contents: {
      first: "Cover page",
      2: "Second page", // Any page number is working. 1-based index
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: "Last Page",
    },
  },
};
let pdfDocument = {
  html: "",
  data: {},
  //   path: "./finiquito.pdf",
  type: "buffer", // "stream" || "buffer" || "" ("" defaults to pdf)
};

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
});
app.get("/generate", function (req, res) {
  var html = fs.readFileSync(
    path.join(__dirname, "./assets/template_copy.html"),
    "utf8"
  );
  let document = { ...pdfDocument };
  document.html = html;
  document.data = {
    users: [
      {
        name: "Shyam",
        age: "26",
      },
      {
        name: "Navjot",
        age: "26",
      },
      {
        name: "Vitthal",
        age: "26",
      },
    ],
  };
  pdf
    .create(document, options)
    .then((pdfResp) => {
      res.contentType("application/pdf");
      res.send(pdfResp);
      console.log(pdfResp);
    })
    .catch((error) => {
      res.send(error);
    });
});
