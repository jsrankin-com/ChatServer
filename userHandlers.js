let users = [];

const userHandlers = {
  addUser: async (client) => {
    users.push(client.chatName);
  },
  removeUser: async (client) => {
    users = users.filter((e) => e !== client);
  },
  exists: async (client) => {
    if (users.includes(client.chatName)) return true;
    else return false;
  },
};
module.exports = { userHandlers };
