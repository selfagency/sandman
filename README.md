# Sandman 🎩🪝

A basic Node.js-based webhook server that executes TypeScript on-demand with [Errsole](https://github.com/errsole/errsole.js) logging.

## Install

\* Skip steps marked with an asterisk for Docker

1. Fork it
2. Clone it

```sh
git clone https://github.com/selfagency/sandman.git
```

3. Install dependencies\*

```sh
pnpm i
```

4. Build the server\*

```sh
pnpm run build
```

5. Create a `.env` file in the project root and add a random value for `LOG_KEY`\*

```sh
LOG_KEY="ye*@^nMGhLQMNun!s*PUnU^!HPrB*Ne2qeLZn^Ek!eZzgq5kjaPZfBL*r45JDqmR"
```

6. Duplicate `config.example.toml` and edit away!

```sh
cp config.example.toml config.toml
code config.toml
```

## Config

1. Drop your TypeScript files in `/scripts`. If bare metal, you can install any dependencies directly into the repo. If Docker, using [pre-bundled scripts](https://tsup.egoist.dev/) or a Git submodule is recommended.
2. Add a corresponding block in `config.toml` where the block header is the name of the script file. Eg., if your script is named `example.ts`:

```toml
[example]
id = "8b9c92d5-6e61-4486-b6c8-04126dd40e09"   # Generate a UUID to serve as the URL
auth = false                                  # Set whether or not to use auth
password = "password"                         # Required if `auth` is true
js = false                                    # Required if file is JS, not TS
```

## Run

### Bare metal

```sh
pnpm run start
```

### Docker

```sh
docker pull ghcr.io/selfagency/sandman:latest
docker run --name sandman \
  -e LOG_KEY=${LOG_KEY} \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/config.toml:/app/config.toml" \
  -v "$(pwd)/scripts:/app/scripts" \
  -p 3000:3000 \
  -p 8001:8001 \
  ghcr.io/selfagency/sandman:latest
```

## Query

```sh
curl -v \
 -X POST \
 -H "Content-Type: application/json" \
 -H "Authorization: Basic ${BASE64_ENCODED_PASSWORD}" \
 -d "{ \"payload\": \"data\" }" \
 "http://localhost:3000/hooks/8b9c92d5-6e61-4486-b6c8-04126dd40e09"
```

## Logging

A realtime logging console is provided via [Errsole](https://github.com/errsole/errsole.js) on port `8001`. You'll be asked to create a username and password the first time you visit it.

A helper function is provided in `/scripts/common.ts` to transmit log messages to Errsole.

## Security Considerations

1. Never commit your `config.toml` file, especially if it has passwords in it.
2. You should absolutely run this behind a reverse proxy (which will provide HTTPS) and a web application firewall to provide defense against malicious actors.
3. Be sure to secure both port `3000` and port `8001`.
