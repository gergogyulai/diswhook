# diswhook

Zero-dependency lightweight Discord webhook client for TypeScript. Uses native `fetch` and `FormData`.

- [Installation](#installation)
- [Quick start](#quick-start)
- [API](#api)
  - [Webhook](#webhook)
  - [MessageBuilder](#messagebuilder)
  - [Embed](#embed)
  - [Button](#button)
  - [Types](#types)
- [Examples](#examples)
- [License](#license)

## Installation

```bash
npm install diswhook
# or
pnpm add diswhook
# or
bun add diswhook
```

**Requires Node.js 18 or later** (uses native `fetch`). This package is ESM-only.

## Quick start

```ts
import { Webhook } from 'diswhook';

const hook = new Webhook({ url: 'YOUR_WEBHOOK_URL' });
await hook.execute({ content: 'Hello, world!' });
```

---

## API

### Webhook

The main client class.

```ts
new Webhook(options: WebhookOptions)
```

#### Methods

| Method | Description |
|---|---|
| `execute(data)` | Send a message. Accepts `ExecuteWebhookData` or a `MessageBuilder.toJSON()` result. |
| `get()` | Fetch the webhook's metadata (`APIWebhook`). |
| `modify(options)` | Update the webhook name, avatar, or channel. Returns the updated `APIWebhook`. |
| `delete()` | Permanently delete the webhook. |
| `setUsername(username)` | Set a default display name applied to all future `execute` calls. |
| `setAvatar(avatarUrl)` | Set a default avatar URL applied to all future `execute` calls. |

### MessageBuilder

Fluent builder for constructing a message payload.

```ts
new MessageBuilder(content?: string)
```

All mutating methods return `this` for chaining. Call `.toJSON()` and pass the result to `Webhook.execute()`.

| Method | Description |
|---|---|
| `addEmbed(embed)` | Append an `Embed` builder or raw `APIEmbed` object. Up to 10 per message. |
| `removeEmbed(index)` | Remove the embed at the given zero-based index. |
| `clearEmbeds()` | Remove all embeds. |
| `addComponent(component)` | Append a `Button` builder or raw `APIMessageComponent`. |
| `toJSON()` | Serialise to a plain object for `Webhook.execute()`. |

### Embed

Fluent builder for Discord embeds.

```ts
new Embed(data?: APIEmbed)
```

All setters return `this` for chaining. Call `.toJSON()` to get the raw embed object.

| Method | Constraints |
|---|---|
| `setTitle(title)` | Max 256 characters. |
| `setDescription(description)` | Max 4096 characters. |
| `setColor(color)` | Hex string (`"#ff0000"`) or decimal integer (0–16777215). |
| `setURL(url)` | Must be a valid `http://` or `https://` URL. |
| `setTimestamp(timestamp?)` | `Date` or ISO 8601 string. Defaults to `new Date()`. |
| `setFooter(text, iconURL?)` | Text max 2048 chars. `iconURL` supports `attachment://`. |
| `setImage(imageURL)` | Supports `attachment://` references. |
| `setThumbnail(url)` | Small image in the top-right corner. |
| `setAuthor(name, url?, iconURL?)` | Name max 256 chars. `iconURL` supports `attachment://`. |
| `addField(name, value, inline?)` | Name max 256, value max 1024 characters. Max 25 fields total. |
| `addFields(fields)` | Batch version of `addField`. |
| `toJSON()` | Returns an `APIEmbed` object. |

### Button

Fluent builder for Discord button components.

```ts
new Button(data?: APIButtonComponent)
```

| Method | Description |
|---|---|
| `setLabel(label)` | Text shown on the button. |
| `setStyle(style)` | `ButtonStyle.Primary`, `Secondary`, `Success`, `Danger`, or `Link`. |
| `setCustomId(customId)` | Identifier for interaction events. Required for non-link buttons. Max 100 characters. |
| `setURL(url)` | URL for `ButtonStyle.Link` buttons. |
| `setEmoji(emoji)` | Unicode string (`"🚀"`) or partial emoji object. |
| `setDisabled(disabled)` | Pass `true` to grey out the button. |
| `toJSON()` | Returns an `APIButtonComponent` object. |

## Examples

### Send a message with an embed

```ts
import { Webhook, Embed, MessageBuilder } from 'diswhook';

const hook = new Webhook({ url: 'YOUR_WEBHOOK_URL' });

const embed = new Embed()
  .setTitle('Deploy succeeded')
  .setDescription('Branch `main` deployed to production.')
  .setColor('#57f287')
  .setTimestamp();

await hook.execute(
  new MessageBuilder().addEmbed(embed).toJSON()
);
```

### Send a file attachment

```ts
import { readFileSync } from 'node:fs';
import { Webhook } from 'diswhook';

const hook = new Webhook({ url: 'YOUR_WEBHOOK_URL' });

await hook.execute({
  content: 'Here is the log:',
  files: [{ name: 'output.log', file: readFileSync('./output.log') }],
});
```

### Embed with an uploaded image (`attachment://`)

```ts
import { readFileSync } from 'node:fs';
import { Webhook, Embed } from 'diswhook';

const hook = new Webhook({ url: 'YOUR_WEBHOOK_URL' });

const embed = new Embed()
  .setTitle('Screenshot')
  .setImage('attachment://screenshot.png');

await hook.execute({
  embeds: [embed.toJSON()],
  files: [{ name: 'screenshot.png', file: readFileSync('./screenshot.png') }],
});
```

### Add a button

```ts
import { Webhook, MessageBuilder, Button, ButtonStyle } from 'diswhook';

const hook = new Webhook({ url: 'YOUR_WEBHOOK_URL' });

const msg = new MessageBuilder('New release available!')
  .addComponent(
    new Button()
      .setLabel('View release')
      .setStyle(ButtonStyle.Link)
      .setURL('https://github.com/your/repo/releases/latest')
  );

await hook.execute(msg.toJSON());
```

### Set a default username and avatar

```ts
const hook = new Webhook({ url: 'YOUR_WEBHOOK_URL' });
hook.setUsername('Deploy Bot');
hook.setAvatar('https://example.com/bot-avatar.png');

// All subsequent execute() calls use the above defaults
await hook.execute({ content: 'Deployment started.' });
```

### Embed with author, footer, and fields

```ts
const embed = new Embed()
  .setAuthor('gergogyulai', 'https://github.com/gergogyulai', 'https://github.com/gergogyulai.png')
  .setTitle('Pull request merged')
  .setColor('#5865f2')
  .addField('Repository', 'diswhook', true)
  .addField('Branch', 'main', true)
  .setFooter('Merged via GitHub Actions')
  .setTimestamp();
```

---

## License

MIT — see [LICENSE](./LICENSE).

## Acknowledgements

- Forked [gaurishhs/discord-webhooks-node](https://github.com/gaurishhs/discord-webhooks-node)