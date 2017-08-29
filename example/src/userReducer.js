const initialState = {
  loggedIn: false,
  name: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return {...state, name: action.name, loggedIn: true}
    case 'LOGOUT':
      return {...state, name: '', loggedIn: false}
    default:
      return state
  }
}
