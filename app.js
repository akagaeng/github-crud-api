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

const createFileContent = (path, base64Content, { branch }) => {
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

const updateFileContent = (path, base64Content, sha, { branch }) => {
  return octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path: path,
    message: `:hammer: Updated ${path}`,
    branch,
    committer: COMMITTER,
    content: base64Content,
    sha,
    headers: HEADERS_2022_11_28,
  })
}

// Update file contents
app.put('/:filename/:sha', async (req, res) => {
  const { filename, sha } = req.params
  const { base64Content, branch } = req.body

  try {
    const path = `${ROOT_PATH}/${filename}`
    const result = await updateFileContent(path, base64Content, sha, { branch })
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

const getFileList = ({ ref }) => {
  return octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path: ROOT_PATH,
    ref,
    headers: HEADERS_2022_11_28,
  })
}

// Get repository content list
app.get('/', async (req, res) => {
  const { branch } = req.query

  try {
    const result = await getFileList({ ref: branch })
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

const getFileContent = async (path, { ref }) => {
  return octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path,
    ref,
    headers: HEADERS_2022_11_28,
  })
}
// Get repository content
app.get('/:filename', async (req, res) => {
  const { filename } = req.params
  const { branch } = req.query

  try {
    const path = filename ? `${ROOT_PATH}/${filename}` : ROOT_PATH
    const result = await getFileContent(path, { ref: branch })
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

const deleteFile = (path, sha, { branch }) => {
  return octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner: OWNER,
    repo: REPO,
    path,
    message: `:x: Deleted ${path}`,
    committer: COMMITTER,
    sha,
    branch,
    headers: HEADERS_2022_11_28,
  })
}

// Delete a file
app.delete('/:filename/:sha', async (req, res) => {
  const { filename, sha } = req.params
  const { branch } = req.query

  try {
    const path = `${ROOT_PATH}/${filename}`
    const result = await deleteFile(path, sha, {
      branch,
    })
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Delete a directory (delete all files under the directory)
app.delete('/dir/:dirName', async (req, res) => {
  const { dirName } = req.params
  const { branch } = req.query

  try {
    const path = `${ROOT_PATH}/${dirName}`
    const { data } = await getFileContent(path, { ref: branch })

    const deleteFiles = data.map((d) => {
      return { path: d.path, sha: d.sha }
    })

    const prom = deleteFiles.map((f) => deleteFile(f.path, f.sha, { branch }))
    await Promise.all(prom)

    res.json({
      status: 200,
      message: `deleted all files in the ${dirName}`,
    })
  } catch (e) {
    res.json(e)
  }
})

const PORT = 8080

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
