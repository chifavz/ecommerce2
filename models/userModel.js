// Placeholder user model. Replace with real DB logic for production.

class UserModel {
  constructor() {
    // In-memory store: [{ id, username, email, password }]
    this.users = [];
    this.currentId = 1;
  }

  getAllUsers() {
    return this.users;
  }

  getUserById(id) {
    return this.users.find(user => user.id === parseInt(id));
  }

  getUserByUsername(username) {
    return this.users.find(user => user.username === username);
  }

  createUser(data) {
    const newUser = {
      id: this.currentId++,
      username: data.username,
      email: data.email,
      password: data.password // In production, hash the password!
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, data) {
    const user = this.getUserById(id);
    if (!user) return null;
    user.username = data.username !== undefined ? data.username : user.username;
    user.email = data.email !== undefined ? data.email : user.email;
    user.password = data.password !== undefined ? data.password : user.password;
    return user;
  }

  deleteUser(id) {
    const index = this.users.findIndex(user => user.id === parseInt(id));
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

module.exports = new UserModel();