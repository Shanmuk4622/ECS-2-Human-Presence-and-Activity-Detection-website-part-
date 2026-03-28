# Contributing to ECS-2

Thank you for contributing.

## Development workflow

1. Fork or create a feature branch from `main`.
2. Keep changes focused and small.
3. Use clear commit messages.
4. Open a pull request with:
   - What changed
   - Why it changed
   - How it was tested

## Local checks

For web changes:

- Run a static server and test:
  - `index.html`
  - `model-viewer.html`
- Verify `.glb` assets load without console errors.

For Python pipeline changes:

1. Create a virtual environment.
2. Install `requirements.txt`.
3. Add/update tests for processing and model code.

## Coding standards

- Follow `.editorconfig` rules.
- Keep functions single-purpose.
- Avoid hard-coded secrets and machine-specific paths.
- Document assumptions for data formats and model inputs.

## Pull request checklist

- [ ] Code builds/runs locally
- [ ] Docs updated if behavior changed
- [ ] No debug logs or temporary files committed
- [ ] New dependencies justified
