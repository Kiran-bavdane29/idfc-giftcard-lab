# Security Lab Scope

This project is an intentionally vulnerable application for **local, authorized security education**. It is not a secure product, a real banking service, or a deployment template. Do not expose it to public networks or use real data, credentials, tokens, or secrets with it.

The application includes deliberately insecure examples in these areas:

| Area | Learning focus |
|---|---|
| Authorization | Object-level access checks and administrative boundaries |
| Input handling | Safe query construction and validation |
| Business logic | Concurrency, transaction integrity, and resource limits |
| Identity and sessions | Token verification and secret management |
| Browser content | Context-aware output encoding |
| Security monitoring | Audit logging and automated security scanning |

These are high-level descriptions, not a production security assessment or a complete list of every issue in the code. Findings from automated scanners are expected and do not indicate that the application is safe or unsafe to deploy; the application must not be deployed at all.

## Safe-use requirements

- Run the lab only on a trusted local machine or an isolated training environment you control.
- Do not make it reachable from the public internet or from untrusted networks.
- Use only disposable demo data and credentials supplied by the project.
- Do not reuse the sample secrets or credentials in any other system.
- Test only this lab or systems for which you have explicit authorization.

## Remediation themes

When discussing mitigations, prefer established secure-development practices: enforce authorization on the server for every object and action, use parameterized database operations, validate and bound user-controlled input, make state changes atomic, use a vetted token-verification configuration with managed secrets, encode output for its rendering context, and protect administrative operations with server-side authorization.

The examples are intentionally unsafe and should not be copied into production code.
