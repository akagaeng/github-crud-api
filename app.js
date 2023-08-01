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

// Create file contents
app.post('/', async (req, res) => {
  const { filename, base64Content } = req.body

  try {
    const result = await octokit.request(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner: OWNER,
        repo: REPO,
        path: `${ROOT_PATH}/${filename}`,
        message: `:low_brightness: Created ${filename}`,
        committer: COMMITTER,
        content: base64Content,
        headers: HEADERS_2022_11_28,
      }
    )
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Update file contents
app.put('/:filename/:sha', async (req, res) => {
  const { filename, sha } = req.params
  const { base64Content } = req.body

  try {
    const result = await octokit.request(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner: OWNER,
        repo: REPO,
        path: `${ROOT_PATH}/${filename}`,
        message: `:hammer: Updated ${filename}`,
        committer: COMMITTER,
        content: base64Content,
        sha,
        headers: HEADERS_2022_11_28,
      }
    )
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Get repository content
app.get('/:filename', async (req, res) => {
  const { filename } = req.params

  try {
    const result = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: OWNER,
        repo: REPO,
        path: filename ? `${ROOT_PATH}/${filename}` : '/',
        headers: HEADERS_2022_11_28,
      }
    )
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Get repository content list
app.get('/', async (req, res) => {
  try {
    const result = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: OWNER,
        repo: REPO,
        path: ROOT_PATH,
        headers: HEADERS_2022_11_28,
      }
    )
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

// Delete a file
app.delete('/:filename/:sha', async (req, res) => {
  const { filename, sha } = req.params

  try {
    const result = await octokit.request(
      'DELETE /repos/{owner}/{repo}/contents/{path}',
      {
        owner: OWNER,
        repo: REPO,
        path: `${ROOT_PATH}/${filename}`,
        message: `:x: Deleted ${filename}`,
        committer: COMMITTER,
        sha,
        headers: HEADERS_2022_11_28,
      }
    )
    res.json(result)
  } catch (e) {
    res.json(e)
  }
})

const PORT = 8080

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
