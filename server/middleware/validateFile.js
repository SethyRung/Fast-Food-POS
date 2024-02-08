const path = require("path");

function validateFile(allowedExtArray, allowedSize) {
  return (req, res, next) => {
    //file payload exists
    if (!req.files)
      return res
        .status(400)
        .json({ status: "error", data: { message: "Missing files" } });

    //file extension limiter
    const files = req.files;
    const fileExtensions = [];
    Object.keys(files).forEach((key) => {
      fileExtensions.push(path.extname(files[key].name));
    });
    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );
    if (!allowed) {
      const message =
        `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
          ",",
          ", "
        );

      return res
        .status(422)
        .json({ status: "error", data: { message: message } });
    }

    //file size limiter
    const fileOverLimit = [];
    Object.keys(files).forEach((key) => {
      if (files[key].size > allowedSize) fileOverLimit.push(files[key].name);
    });

    if (fileOverLimit.length > 0) {
      const properVerb = filesOverLimit.length > 1 ? "are" : "is";

      const sentence =
        `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(
          ",",
          ", "
        );

      const message =
        filesOverLimit.length < 3
          ? sentence.replace(",", " and")
          : sentence.replace(/,(?=[^,]*$)/, " and");

      return res
        .status(413)
        .json({ status: "error", data: { message: message } });
    }

    next();
  };
}

module.exports = validateFile;
