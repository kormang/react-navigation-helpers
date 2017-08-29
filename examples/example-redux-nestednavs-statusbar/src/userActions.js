export function login(username) {
  return {
    type: 'LOGIN',
    name: username
  }
}

export function logout() {
  return {
    type: 'LOGOUT'
  }
}
