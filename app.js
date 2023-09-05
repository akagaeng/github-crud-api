const express = require('express')
const bodyParser = require('body-parser')
const { Octokit } = require('octokit')
require('dotenv').config()

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  retry: { enabled: true },
})

const OWNER = process.env.OWNER
const REPO = process.env.REPO
const ROOT_PATH = 'app'
const COMMITTER = {
  name: process.env.COMMITTER_NAME,
  email: process.env.COMMITTER_EMAIL,
}
const HEADERS_2022_11_28 = { 'X-GitHub-Api-Version': '2022-11-28' }

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const createFileContent = async (path, base64Content, { branch }) => {
  return octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path,
    message: `:low_brightness: Created ${path}`,
    branch,
    committer: COMMITTER,
    content: base64Content,
    headers: HEADERS_2022_11_28,
  })
}

const updateFileContent = async (path, base64Content, { branch }) => {
  const { data } = await getFileContent({ path, ref: branch })

  return octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path: path,
    message: `:hammer: Updated ${path}`,
    branch,
    committer: COMMITTER,
    content: base64Content,
    sha: data?.sha,
    headers: HEADERS_2022_11_28,
  })
}

const getFileContent = async ({ path, ref }) => {
  return octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path,
    ref,
    headers: HEADERS_2022_11_28,
  })
}

const deleteFile = async (path, { branch }) => {
  const { data } = await getFileContent({ path, ref: branch })

  return octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path,
    message: `:x: Deleted ${path}`,
    committer: COMMITTER,
    sha: data?.sha,
    branch,
    headers: HEADERS_2022_11_28,
  })
}

const deleteDirectory = async (path, { branch }) => {
  const { data } = await getFileContent({ path, ref: branch })

  return Promise.all(
    data.map((d) => d.path).map((path) => deleteFile(path, { branch }))
  )
}

// Create file contents
app.post('/', async (req, res) => {
  const { filename, base64Content, branch } = req.body

  try {
    const path = `${ROOT_PATH}/${filename}`
    const result = await createFileContent(path, base64Content, { branch })
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Update file contents
app.put('/', async (req, res) => {
  const { filename, base64Content, branch } = req.body

  try {
    const path = `${ROOT_PATH}/${filename}`
    const result = await updateFileContent(path, base64Content, { branch })
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Get repository content list
app.get('/', async (req, res) => {
  const { filename, branch } = req.query

  try {
    const path = filename ? `${ROOT_PATH}/${filename}` : ROOT_PATH
    const result = await getFileContent({ path, ref: branch })
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Get repository content
app.get('/', async (req, res) => {
  const { filename, branch } = req.query

  try {
    const path = filename ? `${ROOT_PATH}/${filename}` : ROOT_PATH
    const result = await getFileContent({ path, ref: branch })
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Delete a file
app.delete('/', async (req, res) => {
  const { filename, branch } = req.query

  try {
    const path = `${ROOT_PATH}/${filename}`
    const result = await deleteFile(path, {
      branch,
    })
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Delete a directory (delete all files under the directory)
app.delete('/directory', async (req, res) => {
  const { dirName, branch } = req.query

  try {
    const path = `${ROOT_PATH}/${dirName}`
    await deleteDirectory(path, { branch })

    res.json({
      status: 200,
      message: `Deleted the directory ${dirName}`,
    })
  } catch (e) {
    res.json(e)
  }
})

// BASE64

// Encode BASE64
app.post('/base64/encode', async (req, res) => {
  const { content } = req.body

  try {
    res.json({
      status: 200,
      message: 'base64 encoded',
      data: btoa(content),
    })
  } catch (e) {
    res.json(e)
  }
})

// Decode BASE64
app.post('/base64/decode', async (req, res) => {
  const { base64Content } = req.body

  try {
    res.json({
      status: 200,
      message: 'base64 decoded',
      data: atob(base64Content),
    })
  } catch (e) {
    res.json(e)
  }
})

const PORT = 8080

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
