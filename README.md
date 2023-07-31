# github-crud-api

## Prerequisites

* GitHub access token (with `repo` and `workflow` scope)
  * with the `repo` scope: Get, list repository contents / Delete a file
  * with the `workflow` scope: Create or update file contents

## Description

* CRUD REST apis
  * Create or update
  * Get/List
  * Delete
* Using [octokit](https://github.com/octokit/octokit.js)

## Cheat Sheet

### Base 64 Encoding/Decoding

```shell
# Decode (base64 -> utf8
const decoded = Buffer.from(base64Content, "base64").toString('utf8');

# Encode (utf-8 -> base64)
const encoded = Buffer.from(utf8Content).toString('base64')
```
## References

* https://github.com/octokit/plugin-rest-endpoint-methods.js
* https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#delete-a-file
