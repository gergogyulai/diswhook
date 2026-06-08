import {
  APIAllowedMentions,
  APIEmbed,
  APIMessageComponent,
} from 'discord-api-types/v10';

/** Configuration options for creating a {@link Webhook} instance. */
export interface WebhookOptions {
  /** The full Discord webhook URL. */
  url: string;
}

/** A Discord user object. */
export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
}

/** Webhook metadata returned by the Discord API. */
export interface WebhookObject {
  guild_id?: string;
  channel_id?: string;
  user?: User;
  token?: string;
  name: string;
  avatar: string;
  id: string;
  application_id?: string;
  url?: string;
}

/** Options for modifying a webhook via {@link Webhook.modify}. */
export interface ModifyWebhookOptions {
  /** New display name. */
  name?: string;
  /** New avatar URL. */
  avatar?: string;
  /** Move the webhook to a different channel by ID. */
  channel_id?: string;
}

/** Payload for sending a message via {@link Webhook.execute}. */
export interface ExecuteWebhookData {
  /** Message text content. */
  content?: string;
  /** Override the webhook's display name for this message. */
  username?: string;
  /** Override the webhook's avatar URL for this message. */
  avatar_url?: string;
  /** Send the message as text-to-speech. */
  tts?: boolean;
  /** Up to 10 embed objects. */
  embeds?: APIEmbed[];
  /** Allowed mentions control. */
  allowed_mentions?: APIAllowedMentions;
  /** Action row components (buttons, select menus). */
  components?: APIMessageComponent[];
  /** Message flags bitmask. */
  flags?: number;
  /** Thread name when posting to a forum channel. */
  thread_name?: string;
  /** File attachments to upload with the message. */
  files?: DiscordFile[];
}

/** A file attachment to include in a webhook message. */
export interface DiscordFile {
  /** Filename shown in Discord, including extension (e.g. `"screenshot.png"`). */
  name: string;
  /** Raw file content as a `Buffer`. */
  file: Buffer;
}
