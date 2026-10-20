# DevSecOps assets

| File | Purpose |
|---|---|
| `semgrep-rules.yml` | Custom SAST rules tuned to the lab's deliberate flaws (used by the pipeline alongside `p/owasp-top-ten`, `p/javascript`, `p/react`). |
| `gitleaks.toml` | Secret-scanning config; extends defaults with the lab's `IDFC-INTERNAL-APIKEY-*` pattern and weak JWT secret detection. |
| `zap-rules.tsv` | OWASP ZAP baseline rule thresholds. |

The pipeline lives at `.github/workflows/devsecops.yml` with four stages:

1. **SAST** — Semgrep (`semgrep/semgrep` container, JSON report artifact)
2. **SCA** — `npm audit` on backend + frontend plus Trivy filesystem scan
3. **Secrets** — Gitleaks with full git history (`fetch-depth: 0`)
4. **DAST** — `docker compose up` then OWASP ZAP baseline against `http://localhost:5000`

Every stage is expected to report findings on this codebase — that's the teaching material.
