# Gift Card Security Lab

A deliberately vulnerable, full-stack gift-card portal built as a portfolio project for learning application security and demonstrating a DevSecOps workflow.

> [!CAUTION]
> **For local, isolated training only. Do not deploy this application, expose it to the internet, or use real credentials or data.** The app intentionally contains insecure code, weak demo secrets, and seeded test accounts. Automated security scans are expected to report findings.

This is an independent educational project. It is **not affiliated with, endorsed by, or connected to IDFC FIRST Bank**. Any brand names shown in the demo are used only as sample content; this project does not provide banking, payment, or gift-card services.

## Project highlights

- React, Vite, and Tailwind CSS frontend
- Node.js and Express API with SQLite persistence
- Docker Compose setup for running the app locally
- DevSecOps workflow covering static analysis, dependency and filesystem scanning, secret scanning, and a baseline dynamic scan
- Purpose-built insecure scenarios for controlled security-learning exercises

## Architecture

```text
frontend/                 React single-page application
backend/                  Express API and SQLite data layer
devsecops/                Scanner configuration and custom rules
.github/workflows/        GitHub Actions security workflow
docker-compose.yml        Local multi-container setup
VULNERABILITIES.md        Safety notes and high-level lab scope
CONTRIBUTING.md           Contribution and validation guidance
SECURITY.md               Security policy and reporting guidance
```

## Run locally with Docker

Requirements: Docker Desktop or Docker Engine with the Compose plugin.

```console
docker compose up --build
```

Open the frontend at <http://localhost:3000>. The API is available at <http://localhost:5000/api/v1>; its health endpoint is <http://localhost:5000/api/v1/health>.

Stop the containers with `Ctrl+C`, then run `docker compose down`. To also remove the local database volume and its data, run `docker compose down --volumes`.

## Run without Docker

Requirements: Node.js 20 or later and npm.

In one terminal:

```console
cd backend
npm install
npm start
```

In a second terminal:

```console
cd frontend
npm install
npm run dev
```

The frontend development server prints its local URL when it starts. The backend seeds demo data into a local SQLite database on first run. Use only the disposable demo accounts and data created by the project; do not reuse real credentials.

## Verify the local API

With the backend running, open another terminal and run the read-only smoke checks:

```console
cd backend
node scripts/smoke.js
```

The checks cover API health, demo sign-in, the authenticated profile, and the catalog. They do not run vulnerability probes.

## Verify the frontend build

```console
cd frontend
npm install
npm run build
```

The build output is written to `frontend/dist/`.

## DevSecOps workflow

The workflow in `.github/workflows/devsecops.yml` runs on pushes, pull requests, and manual dispatch. It collects findings from Semgrep, npm audit, Trivy, Gitleaks, and OWASP ZAP. Findings are expected because the application is intentionally insecure; the workflow is a demonstration of scanning and reporting, **not a security certification or a production-readiness check**.

## Lab scope and safety

The lab includes intentionally unsafe examples involving authorization, input handling, session/token validation, stored content, and business logic. See [VULNERABILITIES.md](./VULNERABILITIES.md) for the non-procedural scope and safe-use guidance.

Keep the application bound to a trusted local environment. Do not scan or test systems you do not own or have explicit permission to assess. Do not treat this lab as a reference implementation for production security.

## API collection

Import [`giftcard_lab.postman_collection.json`](./giftcard_lab.postman_collection.json) into Postman to try the normal local sign-in, profile, and store flows. The collection uses disposable seeded demo accounts and is intended only for the local instance; it does not include exploit payloads or admin-bypass requests.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for project and pull-request guidance.

## Security

See [SECURITY.md](./SECURITY.md) for the project security policy and guidance on reporting unintended issues.

## License

No license has been selected for this project yet. Until a license is added, no permission to reuse, modify, or redistribute the project is granted.
