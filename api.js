const fs = require('fs')
const { JsonDB } = require('node-json-db')
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

module.exports = {
  getHealth,
  putStudentRecord,
  getStudentRecord,
  deleteStudentRecord
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

function putStudentRecord (req, res, next) {
  const { studentId, propertyName } = req.params
  const { body } = req
  const db = new JsonDB(new Config(`./data/${studentId}`, true, false, '/'))

  db.push(`/${propertyName}`, body)
  res.status(200).json(db.data)
}

function getStudentRecord (req, res, next) {
  const { studentId, propertyName } = req.params
  const filePath = `./data/${studentId}.json`

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File Not Found' })
  }

  const db = new JsonDB(new Config(filePath, true, false, '/'))

  try {
    const result = db.getData(`/${propertyName}`)
    res.json(result)
  } catch (err) {
    res.status(404).json({ error: 'Property Not Found' })
  }
}

function deleteStudentRecord (req, res, next) {
  const { studentId, propertyName } = req.params
  const filePath = `./data/${studentId}.json`

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File Not Found'})
  }

  const db = new JsonDB(new Config(filePath, true, false, '/'))
 // Check if database not found
  if (!db.exists(`/${propertyName}`)) {
    return res.status(404).json({ error: 'Property Not Found' })
  }

  db.delete(`/${propertyName}`)
  res.json({ success: true })
}
