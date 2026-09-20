# openjavaformat.dev

Sources of <https://openjavaformat.dev>, the website of
[open-java-format](https://github.com/openjavaformat/open-java-format).

The site is built with [Zensical](https://zensical.org) and published on GitHub Pages. Pages live
in `docs/` as Markdown, and the whole configuration is `zensical.toml`.

## Editing a page

Every page has an **Edit this page** button. It opens the Markdown file of this repository in
GitHub's editor, and GitHub turns the change into a pull request, forking the repository first if
needed. The pull request is built in strict mode, so a broken link fails the check instead of
reaching the site.

The repository link in the site header deliberately points at the formatter, not here.

## Previewing locally

With [mise](https://mise.jdx.dev):

```bash
mise run serve
```

Without it:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
zensical serve
```

The preview runs on <http://localhost:8000> and reloads on save. `mise run build` runs the same
clean, strict build as CI.

## Publishing

A push to `main` runs `.github/workflows/docs.yml`, which builds the site and deploys it to GitHub
Pages. There is nothing to do by hand.

The custom domain is set in the repository's Pages settings. There is deliberately no `CNAME` file:
GitHub ignores it when a site is deployed by a workflow.

## Upgrading Zensical

The version is pinned in `requirements.txt`, and Dependabot proposes upgrades. Zensical is still
pre-1.0, so read the [changelog](https://zensical.org/docs/changelog/) before merging one.

## License

[Apache License 2.0](LICENSE), the same as open-java-format.
