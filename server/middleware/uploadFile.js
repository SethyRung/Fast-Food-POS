const { error } = require("console");
const path = require("path");
const fs = require("fs");

function uploadFile(desPath) {
  return (req, res) => {
    const files = req.files;
    const fileUploaded = [];
    Object.keys(files).forEach((key) => {
      const newFileName = Date.now() + path.extname(files[key].name);
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        desPath,
        newFileName
      );
      files[key].mv(filePath, (err) => {
        if (err) {
          fileUploaded.forEach((file) => {
            fs.unlink(
              path.join(__dirname, "..", "public", desPath, file),
              (error) => {
                console.log(error.message);
              }
            );
          });
          return res.status(500).json({
            status: "error",
            data: {
              message: err,
            },
          });
        }
      });
      fileUploaded.push(newFileName);
    });

    return res.json({
      status: "success",
      data: {
        message: "File have been uploaded.",
        path: `public/${desPath}`,
        files: fileUploaded,
      },
    });
  };
}

module.exports = uploadFile;
