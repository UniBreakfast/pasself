JSON.same =(a, b)=> JSON.stringify(a) == JSON.stringify(b)

const
  c = console.log,
  sleep = time => new Promise(wakeUp => setTimeout(wakeUp, time)),
  test = (title, finish, err) => (title = "-".repeat(80)+"\nTEST: "+title) &&
    [
      msg => !err && c(title) || c("FAIL: "+msg) || (err=1),
      ()=> !err && (c(title) || c(" OK:  "+finish)),
      msg => {!err && c(title) || c("FAIL: "+msg) || (err=1); throw msg}
    ],
  makeTest =(title, ok, checkFn)=> async swallow => {
    const [ fail, end, crit ] = test(title, ok)
    await checkFn(fail, crit, sleep)
      .catch(err => {if (!swallow || typeof err != 'string') throw err})
    end()
  }

module.exports = makeTest