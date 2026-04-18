# TodoMVC 031

TodoMVC implementation scaffolded with Vite, React, and TypeScript.

## Requirements

- Node.js 20+
- npm 10+

## Run locally

```bash
npm install
npm run dev
```

The Vite dev server runs on `0.0.0.0:8080`.

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Docker

Build image:

```bash
docker build -t todomvc-031 .
```

Run container:

```bash
docker run --rm -p 8080:80 todomvc-031
```

Smoke checks:

```bash
curl -i http://localhost:8080/
curl -i http://localhost:8080/#/active
```

For hash-route refresh behavior, open `http://localhost:8080/#/active` in a browser and refresh the page.
