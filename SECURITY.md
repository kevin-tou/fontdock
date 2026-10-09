# Security

Report vulnerabilities privately to the maintainers via GitHub Security Advisories on [kevin-tou/fontdock](https://github.com/kevin-tou/fontdock/security/advisories/new).

Do not open a public issue for a suspected vulnerability.

fontdock injects a development-only toolbar. `npx fontdock uninstall` must not leave that script in production layouts. CDN URLs in the registry must stay HTTPS and key-free.
