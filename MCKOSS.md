# mckoss fork of Umami

The `mckoss` branch is an Umami release plus fixes that aren't merged
upstream yet. It runs https://stats.mckoss.com (repo `mckoss/umami-analytics`).

- Base: `v3.4.1`
- Fixes: mobile filter field menu cut off (upstream PR #4746)

Each push to `mckoss` runs the unit tests, builds Umami's own `Dockerfile`, and
publishes `ghcr.io/mckoss/umami:<package.json version>`. Raise the
`-mk.N` suffix in `package.json` with every change; the version shows in the
dashboard footer. When upstream releases these fixes, switch
`umami-analytics` back to the official image.
