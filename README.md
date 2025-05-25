# Using Kamal 2.0 in Production

See [book](https://rubys.github.io/kamal-in-production/) live on GitHub Pages.

# Development

Set up the environment:

```
mise trust
mise settings experimental=true
uv venv
uv pip install -r pyproject.toml
```

To view the pages locally:

```sh
mkdocs serve
```

To deploy to GitHub Pages:

```sh
mkdocs gh-deploy
```
