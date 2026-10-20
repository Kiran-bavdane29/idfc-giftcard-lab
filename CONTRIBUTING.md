# Contributing

Thanks for helping improve this educational security lab. Contributions should keep the project safe to run locally, accurately documented, and clearly separate from any real bank or payment service.

## Before opening a pull request

1. Keep changes focused and explain their purpose.
2. Do not add real credentials, tokens, customer data, or secrets. Never reuse the sample values outside this lab.
3. Do not add instructions that target systems other than this local, authorized training application.
4. Update the documentation when setup steps, behavior, or safety guidance changes.
5. Run the relevant checks and include the results in your pull request.

For frontend changes, run:

```console
cd frontend
npm install
npm run build
```

For backend behavior changes, start the backend locally and run the existing smoke script from a second terminal:

```console
cd backend
npm install
npm start
```

```console
cd backend
node scripts/smoke.js
```

The smoke script checks health, demo sign-in, profile, and catalog endpoints only; it does not execute vulnerability probes.

The security workflow may report findings by design. Explain any expected lab findings relevant to your change; do not suppress or misrepresent scan results as proof that the project is secure.

## Pull requests

Include a concise summary, how the change was checked, and any documentation or safety impact. Avoid screenshots containing personal information or real credentials.
