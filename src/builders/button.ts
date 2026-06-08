import {
  APIButtonComponent,
  APIButtonComponentWithURL,
  APIButtonComponentWithCustomId,
  EmojiFormat,
  APIMessageComponentEmoji,
  ButtonStyle,
} from 'discord-api-types/v10';

const isURLButton = (data: unknown): data is APIButtonComponentWithURL =>
  data != null && typeof data === 'object' && 'url' in data;

const isCustomIdButton = (data: unknown): data is APIButtonComponentWithCustomId =>
  data != null && typeof data === 'object' && 'custom_id' in data;

/**
 * Fluent builder for Discord button components.
 *
 * Link button example:
 * ```ts
 * const button = new Button()
 *   .setLabel('Visit Discord')
 *   .setStyle(ButtonStyle.Link)
 *   .setURL('https://discord.com');
 * ```
 *
 * Interactive button example:
 * ```ts
 * const button = new Button()
 *   .setLabel('Click me')
 *   .setStyle(ButtonStyle.Primary)
 *   .setCustomId('my-button');
 * ```
 */
export class Button {
  public label?: string;
  public style?: ButtonStyle;
  public custom_id?: string;
  public url?: string;
  public emoji?: APIMessageComponentEmoji;
  public disabled?: boolean;

  /**
   * @param data - Optional existing button component to initialise from.
   */
  constructor(data?: APIButtonComponent) {
    if (data?.style) this.style = data.style;
    // APIButtonComponentWithSKUId has no label, emoji, url, or custom_id
    if (data && 'label' in data && data.label) this.label = data.label;
    if (data && 'emoji' in data && data.emoji) this.emoji = data.emoji;
    if (isURLButton(data)) this.url = data.url;
    if (isCustomIdButton(data)) this.custom_id = data.custom_id;
    if (data?.disabled) this.disabled = data.disabled;
  }

  /**
   * Sets the button label text.
   * @param label - Text displayed on the button.
   */
  public setLabel(label: string): this {
    this.label = label;
    return this;
  }

  /**
   * Sets the button style.
   * @param style - One of the {@link ButtonStyle} enum values:
   *   `Primary` (blurple), `Secondary` (grey), `Success` (green),
   *   `Danger` (red), or `Link` (grey, opens a URL).
   */
  public setStyle(style: ButtonStyle): this {
    this.style = style;
    return this;
  }

  /**
   * Sets the `custom_id` used to identify this button in interaction payloads.
   * Required for non-link buttons. Maximum 100 characters.
   * @param customId - Developer-defined identifier string.
   */
  public setCustomId(customId: string): this {
    this.custom_id = customId;
    return this;
  }

  /**
   * Sets the URL opened when a link-style button is clicked.
   * Only valid when style is {@link ButtonStyle.Link}.
   * @param url - The URL to navigate to.
   */
  public setURL(url: string): this {
    this.url = url;
    return this;
  }

  /**
   * Sets an emoji displayed on the button alongside the label.
   * @param emoji - A Unicode emoji string (e.g. `"🚀"`) or a partial emoji object with `id` and `name`.
   */
  public setEmoji(emoji: EmojiFormat): this {
    this.emoji = typeof emoji === 'string' ? { name: emoji } : emoji;
    return this;
  }

  /**
   * Enables or disables the button.
   * @param disabled - Pass `true` to grey out and prevent interaction.
   */
  public setDisabled(disabled: boolean): this {
    this.disabled = disabled;
    return this;
  }

  /**
   * Serialises the button to a plain object compatible with the Discord API.
   */
  public toJSON(): APIButtonComponent {
    const base = {
      type: 2 as const,
      label: this.label,
      style: this.style ?? ButtonStyle.Primary,
      emoji: this.emoji,
      disabled: this.disabled,
    };
    if (this.url !== undefined) {
      return { ...base, url: this.url } as APIButtonComponentWithURL;
    }
    return { ...base, custom_id: this.custom_id ?? '' } as APIButtonComponentWithCustomId;
  }
}
