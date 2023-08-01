# github-crud-api

## Prerequisites

* GitHub Personal access token (with `repo` and `workflow` scope)
  * https://github.com/settings/tokens
  * with the `repo` scope: Get, list repository contents / Delete a file
  * with the `workflow` scope: Create or update file contents

## Description

* CRUD REST apis
  * Create or update
  * Get/List
  * Delete
* Using [octokit](https://github.com/octokit/octokit.js)

## Getting Started

### Create `.env`

```shell
cp .env.sample .env
```

### Edit `.env`

| Replace `.env` into yours

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

## Cheat Sheet

### Base 64 Encode / Decode from code

```shell
# Decode (base64 -> utf8
const decoded = Buffer.from(base64Content, "base64").toString('utf8');

# Encode (utf-8 -> base64)
const encoded = Buffer.from(utf8Content).toString('base64')
```

## References

* https://www.npmjs.com/package/octokit
* https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#delete-a-file
* Base64 Encode: https://emn178.github.io/online-tools/base64_encode.html
* Base64 Decode: https://emn178.github.io/online-tools/base64_decode.html
