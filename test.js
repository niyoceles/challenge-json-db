const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

const dummyRecord1 = { score: 98 }
const dummyRecord2 = { score: 100 }

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

tape('PUT student record test', async function (t) {
  t.plan(2)

  const url = `${endpoint}/rn1abu8/courses/calculus/quizzes/ye0ab61`
 
  jsonist.put(url, dummyRecord1, (err, body) => {
    if (err) t.error(err)
    const expectedResult = {
      'courses': {
        'calculus': {
          'quizzes': {
            'ye0ab61':{
              'score': 98
            }
          }
        }
      }
    }
    t.deepEqual(body, expectedResult, 'should be passed successfully')
  })

  jsonist.put(url, dummyRecord2, (err, body) => {
    if (err) t.error(err)
    const expectedResult = {
      'courses': {
        'calculus': {
          'quizzes': {
            'ye0ab61':{
              'score': 100
            }
          }
        }
      }
    }
    t.deepEqual(body, expectedResult, 'should be passed with a new property')
  })
})

tape('GET student record test', async function (t) {
  t.plan(6)
  let url = `${endpoint}/rn1abu9/courses/calculus/quizzes`
  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 404, 'shouldn\'t be passed for not found file ')
    t.equal(body.error, 'File Not Found')
  })

  // fail for not found student data
  url = `${endpoint}/rn1abu8/courses/calculus/quizzes/ye0ab61/badResquest`
  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    const expectedResult = 'Property Not Found'
    t.equal(res.statusCode, 404)
    t.equal(body.error, expectedResult, 'should be failed for not found property')
  })

  url = `${endpoint}/rn1abu8/courses/calculus/quizzes/ye0ab61`
  jsonist.get(url, (err, body, res) => {
    if (err) t.error(err)
    t.equal(res.statusCode, 200)
    t.equal(body.score, 100, 'should be passed successfully')
  })
})

// Delete student test data
tape('DELETE student test', async function (t) {
  t.plan(7)

  let url = `${endpoint}/rn1abu9/courses/calculus/quizzes`
  jsonist.delete(url, (err, body, res) => {
    if (err) t.error(err)
    const expectedResult = 'File Not Found'
    t.equal(res.statusCode, 404)
    t.equal(body.error, expectedResult, 'shouldn\'t be passed for not found file')
  })

  //failed if property doesn't exist in student data
  url = `${endpoint}/rn1abu8/courses/calculus/badResquest`
  jsonist.delete(url, (err, body, res) => {
    if (err) t.error(err)
    const expectedResult = 'Property Not Found'
    t.equal(res.statusCode, 404)
    t.equal(body.error, expectedResult, 'should be failed for property not found')
  })

  // nested property is removed successfullty..
  url = `${endpoint}/rn1abu8/courses/calculus/quizzes`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should be passed successfully')
  })

  url = `${endpoint}/rn1abu8/courses/calculus/quizzes`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.equal(body.error, 'Property Not Found')
  })
  url = `${endpoint}/rn1abu8/`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    const expectedResult = {
      'courses': {
        'calculus': {}
      }
    }
    t.deepEqual(body, expectedResult, 'should be passed successfully')
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
