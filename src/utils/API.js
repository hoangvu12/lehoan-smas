const axios = require("axios");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

class API {
  static async getContact(classID) {
    const URL = `http://smsedu.smas.vn/Sparentapi/api/contacts/pupils/39772000/academicyears/1871034/schools/97078/class/${classID}`;
    const data = await getResponse(URL);

    return data;
  }

  static async getStudy(studentID, classID, semester = 2) {
    const URL = `http://smsedu.smas.vn/Sparentapi/api/study/tt58/pupils/${studentID}/academicyears/1871034/class/${classID}/semesters/${semester}`;

    const data = await getResponse(URL);

    return data;
  }
}

async function getResponse(URL) {
  const headers = {
    Authorization: `Bearer ${process.env.SMAS_TOKEN}`,
  };

  const { data } = await axios.get(URL, { headers });

  return data;
}

module.exports = API;
