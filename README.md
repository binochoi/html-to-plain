# html-to-plain

**Convert HTML to plain text** with one tiny, zero-dependency function. Strip HTML tags, decode HTML entities, and collapse whitespace — without `DOMParser`, so it runs on **Cloudflare Workers (workerd)**, edge runtimes, browsers, and Node.js alike. Ideal for turning rich-text editor output (TipTap, ProseMirror, any WYSIWYG) into clean text for search indexes, notifications, previews, and LLM input.

## Why

Rich-text editors store content as HTML like `<p>…</p>` or `<ul><li>…</li></ul>`, but many places only accept plain text: search indexes, push/email notification bodies, calendar (ICS) event descriptions, list previews and excerpts, character counts, or prompts sent to an LLM. Most HTML-to-text libraries rely on a DOM or pull in a full HTML parser, which isn't available or is too heavy on Cloudflare Workers and other edge runtimes. `html-to-plain` uses a few regular expressions instead and has no dependencies.

- Replaces block boundaries (`</p>`, `</li>`, `<br>`, `<hr>`, headings, table cells, …) with a space so words never run together.
- Decodes named (`&amp;`, `&lt;`, `&nbsp;`, …), decimal (`&#65;`), and hex (`&#x41;`) HTML entities.
- Decodes entities *after* removing tags, so escaped text like `&lt;b&gt;` stays as literal text instead of becoming a tag.
- Collapses consecutive whitespace into one space and trims both ends.
- Returns `""` for `null`, `undefined`, or empty input.

## Use cases

- Indexing rich-text content for full-text search
- Building push, email, or chat notification messages from HTML
- Filling plain-text fields such as calendar event descriptions
- Generating previews, excerpts, and summaries
- Counting characters or words in editor content
- Cleaning HTML before sending it to an LLM

## Install

```sh
npm install html-to-plain
```

## Usage

```ts
import { htmlToPlainText } from "html-to-plain";

htmlToPlainText("<p>Hello &amp; welcome</p><ul><li>First item</li><li>Second item</li></ul>");
// → "Hello & welcome First item Second item"

htmlToPlainText("<p>1 &lt; 2</p><p>&#x1F600;</p>");
// → "1 < 2 😀"

htmlToPlainText(null);
// → ""
```

## API

| Function | Description |
| --- | --- |
| `htmlToPlainText(html)` | `string \| null \| undefined` → `string`. Returns `""` for empty input. |

## Limitations

This is a lightweight text extractor, not an HTML sanitizer or full parser. It does not render layout (lists become space-separated text, not bullets), and it does not remove the contents of `<script>` or `<style>` elements. Do not use its output as safe HTML.

## Development

```sh
pnpm install
pnpm test        # vitest
pnpm lint        # oxlint + tsc
pnpm build:dist  # build dist/ with obuild
```

`pnpm install` runs `obuild --stub` through `prepare`, which creates a stub `dist/` that points at the source so local consumers can use it without a build step. Use `pnpm build:dist` for a real build.

## License

[MIT](./LICENSE)
