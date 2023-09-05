# github-crud-api

## Prerequisites

* GitHub Personal access token (with `repo` and `workflow` scope)
  * https://github.com/settings/tokens
  * with the `repo` scope: Get, list repository contents / Delete a file
  * with the `workflow` scope: Create or update file contents

## Description

* CRUD REST apis
  * Create or update file
  * Get/List file
  * Delete file
  * Delete a directory: deleting all files in a directory deletes the directory
* Using [octokit](https://github.com/octokit/octokit.js)

## API List

| Method | Path           | Request Body                      | Query             | Description                 |
|--------|----------------|-----------------------------------|-------------------|-----------------------------|
| POST   | /              | *filename, *base64Content, branch | -                 | Create file contents        |
| PUT    | /              | *filename, *base64Content, branch | -                 | Update file contents        |
| GET    | /              | -                                 | branch            | Get repository content list |
| GET    | /              | -                                 | *filename, branch | Get repository content      |
| DELETE | /              | -                                 | *filename, branch | Delete a file               |
| DELETE | /directory     | -                                 | *dirName, branch  | Delete a directory          |
| POST   | /base64/encode | *content                          | -                 | Encode Base64               |
| POST   | /base64/decode | *base64Content                    | -                 | Decode Base64               |

## Getting Started

### Create `.env`

```shell
cp .env.sample .env
```

### Edit `.env`

> Replace `.env` into yours

```shell
# Generate token at https://github.com/settings/tokens
GITHUB_TOKEN=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
# GitHub owner or organization name
OWNER=akagaeng
# GitHub repo name
REPO=github-crud-api
# Root path where you commit
ROOT_PATH=app
# Committer name
COMMITTER_NAME=akagaeng
# Committer email
COMMITTER_EMAIL=akagaeng@gmail.com
```

### Run

```shell
# Development
npm run dev

# Production
npm start

```

## References

* https://www.npmjs.com/package/octokit
* https://docs.github.com/en/rest/repos/contents

