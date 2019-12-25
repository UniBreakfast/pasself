
const
  makeTest = require('./tester'),
  { assign, keys, values } = Object,
  c = console.log,
  { hash, compare } = require('bcryptjs'),

  dataElfDuck = {
    async addUser(login, hash) {
      this.addedUser = {login, hash}
      return 7
    }
  },

  passElf = require('.'),
  methods = 'reg, check, change'.split(', '),

  runTests = async ()=> {
    await init()
    await reg(1)
  },

  init = makeTest("passElf module supposed to be exporting an object with one method - a function .attach(dataElf), that supposed to initialize the passElf with a reference to a dataElf object and add the rest of the methods, also it supposed to return the passElf object itself", "and it does all that!",
    async (fail, crit)=> {

    const absent = []

    if (typeof passElf != 'object')
      fail("index.js doesn't export an object")

    if (keys(passElf).length != 1)
      fail("passElf object expected to have exactly one property at first")

    if (!passElf.attach || typeof passElf.attach != 'function')
      crit("there's no .attach(dataElf) method")
    else {
      if (passElf.attach.length != 1)
        fail("the .attach(dataElf) method supposed to expect one argument")

      if (await passElf.attach(dataElfDuck) != passElf)
        fail(".attach(dataElf) method supposed to return the same passElf object")

      methods.splice(0, methods.length,...methods.filter(m =>
        passElf[m] && typeof passElf[m] == 'function'? 1 : absent.push(m) && 0))
      if (absent.length)
        fail("passElf supposed to have methods: "+absent.join(', '))
    }
  }),

  reg = makeTest("passElf.reg(login, pass) supposed to hash the password, add the new record to the users collection via dataElf.addUser(login, hash) and return the id of the record added.", "and it does all that!", async (fail, crit)=> {

    const login = 'Joe', pass = 'jeroniMO',
          answer = await passElf.reg(login, pass)

    if (dataElfDuck.addedUser.login != login)
      crit("passElf.reg(login, pass) didn't call the dataElf.addUser(login, hash)")

    if (!compare(pass, dataElfDuck.addedUser.hash))
      fail("passElf.reg(login, pass) didn't hash the password correctly")

    if (answer != 7)
      fail("passElf.reg(login, pass) didn't return the answer of the dataElf.addUser(login, hash) call")
  }),

  check = makeTest("passElf.check()")

runTests()
