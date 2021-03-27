const Contacts = require("./models/Contacts");

class Cache {
  static async execute() {
    const savedContacts = await Contacts.getSavedContacts();

    this.savedContacts = savedContacts;

    console.log("Cache executed");
  }
}

module.exports = Cache;
