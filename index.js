
let dataElf

const
{ assign, entries } = Object,
{ hash, compare } = require('bcryptjs'),

reg = async (login, pass) => await dataElf.addUser(login, await hash(pass, 4)),

check = async (ref, pass) => {},

change = async (ref, pass) => {},


attach = async dataElfRef => (dataElf = dataElfRef) &&
  assign(exports, {reg, check, change})


assign(exports, {attach})