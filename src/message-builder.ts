import {
  APIEmbed,
  APIMessageComponent,
} from 'discord-api-types/v10';
import { Button } from './builders/button';
import { Embed } from './builders/embed';

/**
 * Fluent builder for constructing a Discord webhook message payload.
 *
 * @example
 * const msg = new MessageBuilder('Hello!')
 *   .addEmbed(new Embed().setTitle('World').setColor('#5865f2'))
 *   .addComponent(new Button().setLabel('Docs').setStyle(ButtonStyle.Link).setURL('https://discord.com'));
 *
 * await hook.execute(msg.toJSON());
 */
export class MessageBuilder {
  private data: {
    embeds: APIEmbed[];
    components: APIMessageComponent[];
    content?: string;
  };

  /**
   * @param content - Optional plain-text content of the message.
   */
  constructor(content?: string) {
    this.data = { embeds: [], components: [], content };
  }

  /**
   * Appends an embed to the message (up to 10 embeds per message).
   * @param embed - An {@link Embed} builder instance or a raw Discord embed object.
   * @returns `this` for chaining.
   */
  addEmbed(embed: Embed | APIEmbed): this {
    this.data.embeds.push(embed instanceof Embed ? embed.toJSON() : embed);
    return this;
  }

  /**
   * Removes the embed at the given index.
   * @param index - Zero-based position of the embed to remove.
   * @returns `this` for chaining.
   */
  removeEmbed(index: number): this {
    this.data.embeds.splice(index, 1);
    return this;
  }

  /**
   * Removes all embeds from the message.
   * @returns `this` for chaining.
   */
  clearEmbeds(): this {
    this.data.embeds = [];
    return this;
  }

  /**
   * Appends a component to the message.
   * @param component - A {@link Button} builder instance or a raw Discord component object.
   * @returns `this` for chaining.
   */
  addComponent(component: APIMessageComponent | Button): this {
    this.data.components.push(
      component instanceof Button
        ? (component.toJSON() as unknown as APIMessageComponent)
        : component,
    );
    return this;
  }

  /**
   * Serialises the message to a plain object suitable for {@link Webhook.execute}.
   */
  toJSON(): object {
    return this.data;
  }
}
