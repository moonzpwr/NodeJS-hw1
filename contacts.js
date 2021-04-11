const fs = require('fs')
const { promises: fsPromise } = fs;
const path = require('path')
const contactsPath = path.join(__dirname, 'db', 'contacts.json')
const shortid = require('shortid');


function listContacts() {
    fsPromise.readFile(contactsPath)
        .then((data) => {
        console.table(JSON.parse(data))//выводим в консоль таблицу контактов
        })
        .catch((err) => {console.log(err);})//отлавливаем ошибки
}

function getContactById(contactId) {    
    fsPromise.readFile(contactsPath)
        .then((data) => {
            const allContacts = JSON.parse(data.toString())//забираем все контакты
            const result = allContacts.find(({ id }) => id.toString() === contactId)//ищем во всех контактах нужный
            if (result === undefined) {
                console.log('No such contact exists!');
                return
            }
            console.table(result);//выводим в консоль нужный контакт
        }).catch((err) => {console.error(err.message);})//отлавливаем ошибки
}

async function removeContact(contactId) {
  fsPromise.readFile(contactsPath)
        .then((data) => {
            const allContacts = JSON.parse(data)//забираем все контакты
            const newList = allContacts.filter(({ id }) => id.toString() !== contactId);//делаем новый массив где удаляем нужный контакт
            if (allContacts.find(({ id }) => id.toString() === contactId) === undefined){//проверка существует ли запрашиваемый контакт
                console.log('No such contact exists!');
                return
            }
            fsPromise.writeFile(contactsPath, JSON.stringify(newList))//перезаписываем в файл новый масив
            console.log(`Contact successfully deleted!`);
            listContacts()//показываем обновленный список контактов

        })
        .catch((err) => { console.log(err); })//отлавливаем ошибки
}


function addContact(name, email, phone) {
  fsPromise.readFile(contactsPath)
      .then((data) => {
          const allContacts = JSON.parse(data)//забираем все контакты
          const newContact = { id: shortid.generate(), name, email, phone }//генерируем новый контакт
          if (allContacts.find(contact =>contact.name === name)) {//проверяем нет ли уже сонтакта с таким именем
                 console.log('Contact with this name alredy exist!');
                return
            }
           allContacts.push(newContact)//добавляем новый контакт в список всех контактов 
            fsPromise.writeFile(contactsPath, JSON.stringify(allContacts))//перезаписываем в файл новый масив
          console.log(`Contact ${name} successfully added!`);//сообщение о том, что контакт успешно добавлен
          listContacts()//показываем обновленный список контактов
          
        })
        .catch((err) => { console.log(err); })//отлавливаем ошибки
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}