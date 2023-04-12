const { storage } = require("../services.js");

async function saveFileToFirebase({uuid, buffer, originalname, mimetype }) {

  try {
    const fileName = `${mimetype.split("/")[0]}s/${uuid + originalname}`;

    const file = storage.bucket().file(fileName);

    await file.save(buffer, {
      metadata: {
        contentType: mimetype,
      },
    });

    const signedUrl = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2100' 
      });

    console.log(`${mimetype} saved to Firebase Storage with name ${originalname}`);
    return signedUrl[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = { saveFileToFirebase };
