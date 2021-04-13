const { table } = require('console');
const fs = require('fs')
const { promises: fsPromise } = fs;
const path = require('path')
const contactsPath = path.join(__dirname, 'db', 'contacts.json')
const shortid = require('shortid');


async function listContacts() {
    try {
        const data = await fsPromise.readFile(contactsPath)
        console.table(JSON.parse(data))
        return JSON.parse(data)
    } catch (error) {
        console.log(error);
    }
}

async function getContactById(contactId) {
    try {
        const data = await fsPromise.readFile(contactsPath)
        const contact = JSON.parse(data).find(({ id }) => id.toString() === contactId)
        if (contact === undefined) {
             console.log('No such contact exists!');
                return
        }
        console.table(contact);
    } catch (error) {
        console.log(error);
    }
}

async function removeContact(contactId) {
    try {
        const data = await fsPromise.readFile(contactsPath)
        const newList = JSON.parse(data).filter(({ id }) => id.toString() !== contactId)
        if (JSON.parse(data).find(({ id }) => id.toString() === contactId) === undefined){//проверка существует ли запрашиваемый контакт
                console.log('No such contact exists!');
                return
        }
        await fsPromise.writeFile(contactsPath, JSON.stringify(newList))
        console.log(`Contact successfully deleted!`);
        await listContacts()
    } catch (error) {
       console.log(error); 
    }
}


async function addContact(name, email, phone) {
    try {
        const data = await fsPromise.readFile(contactsPath)
        const parseData = JSON.parse(data)
        const newContact = { id: shortid.generate(), name, email, phone }
        if (parseData.find(contact =>contact.name === name)) {//проверяем нет ли уже сонтакта с таким именем
                 console.log('Contact with this name alredy exist!');
                return
        }
        parseData.push(newContact)
        await fsPromise.writeFile(contactsPath, JSON.stringify(parseData))
        console.log(`Contact ${name} successfully added!`);
        await listContacts()
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}