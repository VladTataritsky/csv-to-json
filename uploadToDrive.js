const fs = require("fs");
const { google } = require("googleapis");

const scopes = ["https://www.googleapis.com/auth/drive"];
const keyFile = "creds.json";

const uploadToDrive = (resultFile) => {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes,
  });

  async function uploadFile(auth) {
    const driveService = google.drive({ version: "v3", auth });

    let fileMetaData = {
      name: "result.json",
      parents: ["17LlL4XZK4lj16Cq5aiIQ5eYbsPsUiOhv"],
    };

    let media = {
      mimeType: "application/json",
      body: fs.createReadStream(resultFile),
    };

    let response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      fields: "id"
    });


    switch (response.status) {
      case 200:
        console.log("file created and uploaded to drive, id:", response.data.id);
        break;
    }
  }

  uploadFile(auth).catch(err => console.log("error:", err));
};

module.exports = uploadToDrive;
