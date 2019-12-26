
let dataElf

const
  { assign } = Object, { min, max } = Math,
  { hash, compare } = require('bcryptjs'),

  reg = async (login, pass) => await dataElf.addUser(login, await hash(pass,4)),

  idLock = {}, loginLock = {},
  secs = [0, 0, 0, 3, 7, 15, 30, 60, 120, 240],

  check = async (ref, pass) => {
    if (idLock[ref] || loginLock[ref]) return null
    const idRef = typeof ref=='number',
          user = await dataElf.user(idRef? ref : {login: ref})
    if (!user) return false;
    (idRef? idLock : loginLock)[ref] = true
    const now = Date.now(), { last=now, guess=-1, hash, id } = user,
          nowGuess = now-last > 3e5? 0 : min(guess+1, 9),
          delay = max(0, secs[nowGuess]*1e3 - (now-last));
    dataElf.updUser(id, {guess: nowGuess})
    await new Promise(go => setTimeout(go, delay))
    const verdict = await compare(pass, hash)
    dataElf.updUser(id, {last: Date.now()})
    delete (idRef? idLock : loginLock)[ref]
    if (verdict) dataElf.updUser(id, {guess: -1})
    return verdict
  },

  change = async (ref, pass) =>
    await dataElf.updUser(typeof ref=='number'? ref : {login: ref},
      {hash: await hash(pass, 4)}),

  attach = async dataElfRef => (dataElf = dataElfRef) &&
    assign(exports, {reg, check, change})


assign(exports, {attach})