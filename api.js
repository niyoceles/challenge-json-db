const fs = require('fs')
const { JsonDB } = require('node-json-db')
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

module.exports = {
  getHealth,
  putStudentData,
  getStudentData,
  deleteStudentData
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

// Put student
function putStudentData (req, res, next) {
  const { studentId, propertyName } = req.params
  const { body } = req
  const db = new JsonDB(new Config(`./data/${studentId}`, true, false, '/'))

  db.push(`/${propertyName}`, body)
  res.status(200).json(db.data)
}

// Get student
function getStudentData (req, res, next) {
  const { studentId, propertyName } = req.params
  const filePath = `./data/${studentId}.json`

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      error: 'File Not Found' 
    })
  }

  const db = new JsonDB(new Config(filePath, true, false, '/'))

  try {
    const result = db.getData(`/${propertyName}`)
    res.status(200).json(result)
  } catch (err) {
    res.status(404).json({ 
      error: 'Property Not Found'
    })
  }
}

// Delete student
function deleteStudentData (req, res, next) {
  const { studentId, propertyName } = req.params
  const filePath = `./data/${studentId}.json`

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      error: 'File Not Found' 
    })
  }

  const db = new JsonDB(new Config(filePath, true, false, '/'))
 // check if db not found
  if (!db.exists(`/${propertyName}`)) {
    return res.status(404).json({ 
      error: 'Property Not Found' 
    })
  }

  db.delete(`/${propertyName}`)
  res.status(200).json({ 
    success: true 
  })
}
