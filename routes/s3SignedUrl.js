var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
require("dotenv").config();

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_accessKeyId;
AWS.config.secretAccessKey = process.env.AWS_secretAccessKey;
AWS.config.region = process.env.AWS_region;

router.post("/get-s3-signed-url", function(req, res, next) {
  console.log(req.body);
  const params = {
    Bucket: "hooty",
    Key: req.body.name,
    Expires: 15000,
    ContentType: req.body.type
  };
  const s3 = new AWS.S3();
  s3.getSignedUrl("putObject", params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
