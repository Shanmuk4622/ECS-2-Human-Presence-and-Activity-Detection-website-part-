# Security Policy

## Supported versions

This repository is currently in active development. Security updates are applied on a best-effort basis.

## Reporting a vulnerability

Please do not open public issues for security-sensitive findings.

Instead, share:

- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested remediation (if available)

For repository maintainers:

1. Acknowledge receipt.
2. Reproduce and triage severity.
3. Patch and validate.
4. Publish a fix note in `CHANGELOG.md`.

## Security best practices for contributors

- Never commit credentials, tokens, or private keys.
- Use environment variables for sensitive values.
- Validate external input in any future API/pipeline modules.
- Keep dependencies updated and pinned where practical.
