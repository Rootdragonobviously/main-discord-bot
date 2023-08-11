import { Listener } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.MessageCreate,
	once: false,
	enabled: false
})
export class ReadyListener extends Listener {
	readonly channel = '1077960509615251557';

	readonly regexes = [
		'(?<youtube>youtu(.be/.+|be.com/(watch?v=.+)))',
		'(?<twitch>twitch.tv/.+)',
		'(?<tiktok>tiktok.com/@.+/video/.+|vm.tiktok.com/.+)'
	];

	public override async run(message: Message) {
		if (message.channelId !== this.channel) return;

		const CONTENTS = message.content.split(/(?:\n| )+/);
		const REGEX = new RegExp(`^https?:\/\/(www\.)?(${this.regexes.join('|')})$`);

		let hasLink = false;
		for (let content of CONTENTS) {
			const RESULT = REGEX.exec(content);

			if (!RESULT) continue;

			hasLink = true;
			break;
		}

		if (!hasLink) message.delete();
		return;
	}
}