import {
  APIEmbed,
  APIEmbedAuthor,
  APIEmbedField,
  APIEmbedFooter,
  APIEmbedImage,
  APIEmbedThumbnail,
} from 'discord-api-types/v10';

const HEXCODE_REGEX = /^#?([a-fA-F0-9]{6})$/;
const URL_REGEX =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

/**
 * Fluent builder for Discord embed objects.
 *
 * @example
 * const embed = new Embed()
 *   .setTitle('Hello World')
 *   .setDescription('This is a test embed')
 *   .setColor('#5865f2')
 *   .setTimestamp();
 */
export class Embed {
  public title?: string;
  public description?: string;
  public url?: string;
  public timestamp?: string | Date;
  public color?: number;
  public footer?: APIEmbedFooter;
  public image?: APIEmbedImage;
  public thumbnail?: APIEmbedThumbnail;
  public author?: APIEmbedAuthor;
  public fields: APIEmbedField[];

  /**
   * @param data - Optional existing embed data to initialise from.
   */
  constructor(data?: APIEmbed) {
    if (data?.title) this.title = data.title;
    if (data?.description) this.description = data.description;
    if (data?.url) this.url = data.url;
    if (data?.timestamp) this.timestamp = data.timestamp;
    if (data?.color) this.color = data.color;
    if (data?.footer) this.footer = data.footer;
    if (data?.image) this.image = data.image;
    if (data?.thumbnail) this.thumbnail = data.thumbnail;
    if (data?.author) this.author = data.author;
    this.fields = data?.fields ?? [];
  }

  /**
   * Sets the embed title.
   * @param title - Maximum 256 characters.
   * @throws {TypeError} If `title` is not a string or exceeds 256 characters.
   */
  setTitle(title: string): this {
    if (typeof title !== 'string') throw new TypeError('Title must be a string');
    if (title.length > 256) throw new TypeError('Title must not exceed 256 characters');
    this.title = title;
    return this;
  }

  /**
   * Sets the embed description.
   * @param description - Maximum 4096 characters.
   * @throws {TypeError} If `description` is not a string or exceeds 4096 characters.
   */
  setDescription(description: string): this {
    if (typeof description !== 'string') throw new TypeError('Description must be a string');
    if (description.length > 4096) throw new TypeError('Description must not exceed 4096 characters');
    this.description = description;
    return this;
  }

  /**
   * Sets the embed accent color.
   * @param color - A hex string (`"#ff0000"` or `"ff0000"`) or a decimal integer (0–16777215).
   * @throws {TypeError} If the value is not a valid hex code or is out of range.
   */
  setColor(color: string | number): this {
    if (typeof color !== 'string' && typeof color !== 'number') {
      throw new TypeError(
        `Invalid color type: expected string or number, received ${typeof color}`,
      );
    }
    if (typeof color === 'number') {
      if (color < 0 || color > 16777215) throw new TypeError('Color must be between 0 and 16777215');
      this.color = color;
    } else {
      const match = color.match(HEXCODE_REGEX);
      if (!match) throw new TypeError('Invalid hex color code');
      this.color = parseInt(match[1], 16);
    }
    return this;
  }

  /**
   * Sets the embed URL, making the title a hyperlink.
   * @param url - A valid `http://` or `https://` URL.
   * @throws {TypeError} If `url` is not a valid URL.
   */
  setURL(url: string): this {
    if (typeof url !== 'string') throw new TypeError('URL must be a string');
    if (!URL_REGEX.test(url)) throw new TypeError('Not a valid URL');
    this.url = url;
    return this;
  }

  /**
   * Sets the embed timestamp shown in the footer area.
   * @param timestamp - A `Date` object or ISO 8601 string. Defaults to the current time.
   * @throws {TypeError} If `timestamp` cannot be parsed as a valid date.
   */
  setTimestamp(timestamp: string | Date = new Date()): this {
    if (Number.isNaN(new Date(timestamp).getTime())) throw new TypeError('Invalid timestamp');
    this.timestamp = new Date(timestamp);
    return this;
  }

  /**
   * Sets the embed footer.
   * @param text - Footer text. Maximum 2048 characters.
   * @param iconURL - Optional small icon displayed before the text.
   *   Supports `attachment://` references for uploaded files.
   * @throws {TypeError} If `text` exceeds 2048 characters or the URL is invalid.
   */
  setFooter(text: string, iconURL?: string): this {
    if (typeof text !== 'string') throw new TypeError('Footer text must be a string');
    if (text.length > 2048) throw new TypeError('Footer text must not exceed 2048 characters');
    this.footer = { text };
    if (iconURL !== undefined) {
      if (typeof iconURL !== 'string') throw new TypeError('Icon URL must be a string');
      if (!iconURL.startsWith('attachment://') && !URL_REGEX.test(iconURL)) {
        throw new TypeError('Not a valid URL');
      }
      this.footer.icon_url = iconURL;
    }
    return this;
  }

  /**
   * Sets the embed image.
   * @param imageURL - Image URL. Supports `attachment://` references for uploaded files.
   * @throws {TypeError} If the URL is invalid.
   */
  setImage(imageURL: string): this {
    if (typeof imageURL !== 'string') throw new TypeError('Image URL must be a string');
    if (!imageURL.startsWith('attachment://') && !URL_REGEX.test(imageURL)) {
      throw new TypeError('Not a valid URL');
    }
    this.image = { url: imageURL };
    return this;
  }

  /**
   * Sets the embed thumbnail (small image in the top-right corner).
   * @param url - Thumbnail URL.
   * @throws {TypeError} If `url` is not a string.
   */
  setThumbnail(url: string): this {
    if (typeof url !== 'string') throw new TypeError('Thumbnail URL must be a string');
    this.thumbnail = { url };
    return this;
  }

  /**
   * Sets the embed author section displayed above the title.
   * @param name - Author name. Maximum 256 characters.
   * @param url - Optional URL the author name links to.
   * @param iconURL - Optional small author icon. Supports `attachment://` references.
   * @throws {TypeError} If `name` is not a string or exceeds 256 characters.
   */
  setAuthor(name: string, url?: string, iconURL?: string): this {
    if (typeof name !== 'string') throw new TypeError('Author name must be a string');
    if (name.length > 256) throw new TypeError('Author name must not exceed 256 characters');
    this.author = { name };
    if (url !== undefined) this.author.url = url;
    if (iconURL !== undefined) this.author.icon_url = iconURL;
    return this;
  }

  /**
   * Adds a single field to the embed.
   * @param name - Field label. Maximum 256 characters.
   * @param value - Field content. Maximum 1024 characters.
   * @param inline - Whether to display this field inline. Optional, defaults to `false`.
   * @throws {TypeError} If the embed already has 25 fields or any argument is invalid.
   */
  addField(name: string, value: string, inline?: boolean): this {
    if (this.fields.length >= 25) throw new TypeError('Embeds cannot exceed 25 fields');
    if (typeof name !== 'string') throw new TypeError('Field name must be a string');
    if (typeof value !== 'string') throw new TypeError('Field value must be a string');
    if (name.length > 256) throw new TypeError('Field name cannot exceed 256 characters');
    if (value.length > 1024) throw new TypeError('Field value cannot exceed 1024 characters');
    this.fields.push({ name, value, inline });
    return this;
  }

  /**
   * Adds multiple fields to the embed in one call.
   * @param fields - Array of field objects (`{ name, value, inline? }`).
   * @throws {TypeError} If any individual field is invalid (see {@link addField}).
   */
  addFields(fields: APIEmbedField[]): this {
    for (const field of fields) {
      this.addField(field.name, field.value, field.inline);
    }
    return this;
  }

  /**
   * Serialises the embed to a plain object compatible with the Discord API.
   */
  toJSON(): APIEmbed {
    return {
      title: this.title,
      description: this.description,
      url: this.url,
      color: this.color,
      timestamp: this.timestamp instanceof Date ? this.timestamp.toISOString() : this.timestamp,
      footer: this.footer,
      image: this.image,
      thumbnail: this.thumbnail,
      author: this.author,
      fields: this.fields.length > 0 ? this.fields : undefined,
    };
  }
}
