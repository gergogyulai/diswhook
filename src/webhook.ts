import { DiscordFile, ExecuteWebhookData, ModifyWebhookOptions, WebhookOptions } from './types';
import { APIWebhook } from 'discord-api-types/v10';

/**
 * Client for sending messages and managing a Discord webhook.
 *
 * @example
 * const hook = new Webhook({ url: 'https://discord.com/api/webhooks/...' });
 * await hook.execute({ content: 'Hello, world!' });
 */
export class Webhook {
  /** Default fields merged into every {@link execute} call. */
  defaultPayload?: Record<string, unknown>;

  /**
   * @param options - Webhook configuration containing the full webhook URL.
   */
  constructor(private options: WebhookOptions) {}

  /**
   * Retrieves the webhook's metadata from the Discord API.
   * @returns The webhook object as returned by Discord.
   */
  public async get(): Promise<APIWebhook> {
    return this.request<APIWebhook>(this.options.url);
  }

  /**
   * Sets a default display name applied to every subsequent {@link execute} call.
   * @param username - Override username.
   */
  public setUsername(username: string): void {
    this.defaultPayload = { ...this.defaultPayload, username };
  }

  /**
   * Sets a default avatar URL applied to every subsequent {@link execute} call.
   * @param avatar - Override avatar URL.
   */
  public setAvatar(avatar: string): void {
    this.defaultPayload = { ...this.defaultPayload, avatar_url: avatar };
  }

  /**
   * Updates the webhook's name, avatar, or channel.
   * @param options - Fields to change. All fields are optional.
   * @returns The updated webhook object.
   */
  public async modify(options: ModifyWebhookOptions): Promise<APIWebhook> {
    return this.request<APIWebhook>(this.options.url, 'PATCH', options);
  }

  /**
   * Permanently deletes the webhook.
   */
  public async delete(): Promise<void> {
    return this.request<void>(this.options.url, 'DELETE');
  }

  /**
   * Sends a message through the webhook.
   *
   * @param data - Message payload. You can pass a {@link MessageBuilder} result
   *   (`builder.toJSON()`) or a plain object matching {@link ExecuteWebhookData}.
   * @throws {Error} If Discord returns a non-2xx response.
   *
   * @example
   * await hook.execute({ content: 'Hello!' });
   * await hook.execute(new MessageBuilder('Hi').addEmbed(embed).toJSON());
   */
  public async execute(data: ExecuteWebhookData): Promise<void> {
    const payload = this.defaultPayload ? { ...this.defaultPayload, ...data } : data;
    return this.request<void>(this.options.url, 'POST', payload, data.files);
  }

  private async request<T = unknown>(
    url: string,
    method = 'GET',
    postData?: unknown,
    file?: DiscordFile | DiscordFile[],
  ): Promise<T> {
    let body: BodyInit | undefined;
    const headers: Record<string, string> = {};

    if (file) {
      const form = new FormData();
      for (const f of Array.isArray(file) ? file : [file]) {
        // Buffer<ArrayBufferLike> fails TS 5.x strict BlobPart check; safe at runtime
        form.append(f.name, new Blob([f.file as unknown as ArrayBuffer]), f.name);
      }
      if (postData != null) form.append('payload_json', JSON.stringify(postData));
      body = form;
      // No Content-Type header — fetch sets it automatically with the multipart boundary
    } else if (postData != null) {
      body = JSON.stringify(postData);
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, { method, headers, body });
    if (res.status === 204) return undefined as T;
    if (!res.ok) throw new Error(`Discord API error ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }
}
