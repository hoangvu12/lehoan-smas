const path = require("path");
const fs = require("fs").promises;

const filePath = path.resolve(__dirname, "./contacts.json");

class Contacts {
  static async getSavedContacts() {
    const rawSavedContacts = await fs.readFile(filePath, "utf-8");
    const savedContacts = JSON.parse(rawSavedContacts);

    return savedContacts;
  }

  static async saveContact(contactID, contactList) {
    const savedContacts = await this.getSavedContacts();

    savedContacts[contactID] = contactList;

    fs.writeFile(filePath, JSON.stringify(savedContacts));
  }
}

module.exports = Contacts;
