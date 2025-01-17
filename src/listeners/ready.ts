import { Listener } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Client, ActivityType } from 'discord.js';
import noblox, { type UniverseInformation } from 'noblox.js';

interface CountdownDetails { value: number | null, string: string | null, remaining: "SECONDS" | "MINUTES" | "HOURS" | "DAYS" | null }

@ApplyOptions<Listener.Options>({
	event: Events.ClientReady,
	once: true
})
export class ReadyListener extends Listener {
	private statusUpdate: number = 10;
	private currentStatus: "COUNTDOWN" | "OAK_PLAYING" | "ALL_PLAYING" = "OAK_PLAYING";
	private oakPlaying: number = 0;

	// References from https://stackabuse.com/javascript-get-number-of-days-between-dates
	private countdown(end: Date, start: Date = new Date(Date.now())): CountdownDetails {
		const second = 1000;
		const minute = second * 60;
		const hour = minute * 60;
		const day = hour * 24;

		const diff = end.getTime() - start.getTime();

		const daysLeft = Math.floor(diff / day);
		const hoursLeft = Math.round(diff / hour);
		const minutesLeft = Math.round(diff / minute);
		const secondLeft = Math.round(diff / second);

		switch (true) {
			case secondLeft <= 0:
				return {
					value: null,
					string: null,
					remaining: null
				};
			case secondLeft < 60:
				return {
					value: secondLeft,
					string: secondLeft > 1 ? `${secondLeft} seconds` : `${secondLeft} second`,
					remaining: "SECONDS"
				}
			case minutesLeft < 60:
				return {
					value: minutesLeft,
					string: minutesLeft > 1 ? `${minutesLeft} minutes` : `${minutesLeft} minute`,
					remaining: "MINUTES"
				}
			case hoursLeft < 24:
				return {
					value: hoursLeft,
					string: `${hoursLeft} hours`,
					remaining: "HOURS"	
				}
			default:
				return {
					value: hoursLeft, // Uses hours because it's the total between the days and hours
					string: daysLeft > 1 ? `${daysLeft} days ${hoursLeft % 24} hours` : `${daysLeft} day ${hoursLeft % 24} hours`,
					remaining: "DAYS"
				}
		}
	}

	private async players(universe: number, oldPlaying: number) {
		const game = (await noblox.getUniverseInfo(universe).catch(() => null)) as unknown as UniverseInformation[];
		if (!game) return oldPlaying;

		let playing = game[0].playing;
		if (typeof playing !== 'number' || playing === oldPlaying) {
			return oldPlaying;
		}

		return playing;
	}

	private async statusInverval(client: Client) {
		switch (this.currentStatus) {
			case "COUNTDOWN":
				this.currentStatus = "OAK_PLAYING";

				const time = this.countdown(new Date("Jan 1, 2024 00:00:00 UTC-05:00"));
				if (time.value === null) {
					client.user?.setActivity({
						type: ActivityType.Watching,
						name: `New Year 2024!`
					});

					break;
				}

				client.user?.setActivity({
					type: ActivityType.Watching,
					name: `2023 tick away・${time.string}`
				});

				break;
			case "OAK_PLAYING":
				this.oakPlaying = await this.players(3666294218, this.oakPlaying);

				client.user?.setActivity({
					type: ActivityType.Watching,
					name: `Oaklands・${this.oakPlaying} playing`
				});

				break;
		}

		setTimeout(() => {
			return this.statusInverval(client);
		}, this.statusUpdate * 1000);
	}

	// private async banBots(client: Client) {
	// 	const botAccounts = [
	// 		"1185030898148724777",
	// 		"956131521733984287",
	// 		"956097947727179806",
	// 		"1185045871478448242",
	// 		"932096380879667253",
	// 		"956246550152118374",
	// 		"928549000431407164",
	// 		"976786710836944936",
	// 		"956128945227567145",
	// 		"956137602564640799",
	// 		"956237066503585873",
	// 		"932098848900411423",
	// 		"932079867003039804",
	// 		"956054319529066527",
	// 		"932082257689190450",
	// 		"956131426250657862",
	// 		"932041199282454528",
	// 		"1185048077468450947",
	// 		"1185034806908682281",
	// 		"1185046309976166460",
	// 		"928561259069177947",
	// 		"1185046163473309696",
	// 		"956350881241104495",
	// 		"978778806863151114",
	// 		"923404990511480852",
	// 		"1172074070901264404",
	// 		"928453229740712006",
	// 		"956292731880239176",
	// 		"975468900244398151",
	// 		"1185046537944973383",
	// 		"956126507984637982",
	// 		"956119888991232050",
	// 		"1185044083996098590",
	// 		"928490228841328680",
	// 		"1172076548791226439",
	// 		"1185044808637616159",
	// 		"1185047344148918509",
	// 		"1185035242222923927",
	// 		"1185047045413797898",
	// 		"1185038000795680769",
	// 		"956080137932259398",
	// 		"1210161585658798100",
	// 		"932084358326681662",
	// 		"956069338820001837",
	// 		"956173030218940486",
	// 		"956261113115336774",
	// 		"956104664821157918",
	// 		"956178931512410222",
	// 		"956031608144666665",
	// 		"923351918439436309",
	// 		"1185019322331045902",
	// 		"1185051129147555890",
	// 		"1185050948675047539",
	// 		"956375867632799787",
	// 		"1185045560273666170",
	// 		"1185046383015760016",
	// 		"1210165420493905982",
	// 		"1185046791826178099",
	// 		"1185047847557672993",
	// 		"1185036634270478406",
	// 		"1185042820009054312",
	// 		"956075132571508757",
	// 		"956164930061619230",
	// 		"1185033314189443133",
	// 		"959468187328589845",
	// 		"1185039817231323187",
	// 		"956037057157943377",
	// 		"956222023816847411",
	// 		"1185010648120303717",
	// 		"1171219789738410037",
	// 		"1185036106257944677",
	// 		"1185045436331982848",
	// 		"1171206094794797191",
	// 		"956035417860362308",
	// 		"1185047194261274665",
	// 		"1185043981785112728",
	// 		"1171223723714556015",
	// 		"974926574346440765",
	// 		"1185047344023081011",
	// 		"932033861699919882",
	// 		"1171223836973338634",
	// 		"1185033074304630936",
	// 		"1185047968886308895",
	// 		"928483283698851901",
	// 		"1171225487494893622",
	// 		"1185038081322135603",
	// 		"956200330251624468",
	// 		"1210212474780127232",
	// 		"928350122843193385",
	// 		"1185047033183227947",
	// 		"1172086562176114689",
	// 		"1210158972280111164",
	// 		"1185037104523268189",
	// 		"1210170987073503265",
	// 		"956153059371810836",
	// 		"1185047092478095443",
	// 		"928369956716937287",
	// 		"1185035279791292469",
	// 		"1171196139647803513",
	// 		"1172080432389574690",
	// 		"932054618568032336",
	// 		"928318741060673627",
	// 		"923426902574759976",
	// 		"928591647611179018",
	// 		"1185021551825920066",
	// 		"932086630767013908",
	// 		"956192794014269481",
	// 		"1185044716111265799",
	// 		"932033514931650640",
	// 		"928366751090106368",
	// 		"956004017299927061",
	// 		"1171227973450469426",
	// 		"923435722025869312",
	// 		"1172105789494792242",
	// 		"1185039549991235654",
	// 		"1185047411605897301",
	// 		"919301068620435467",
	// 		"1185039045747818610",
	// 		"1185037967992037489",
	// 		"1171205707576660133",
	// 		"1185038424101629962",
	// 		"956202276408688650",
	// 		"1185036303155335240",
	// 		"932067526681186414",
	// 		"956210819325132921",
	// 		"1172073543836631040",
	// 		"1185039095211241552",
	// 		"1185043232661450814",
	// 		"928398544392560743",
	// 		"1185043681737179197",
	// 		"932082311263039488",
	// 		"1185045337325449267",
	// 		"1185047444619284641",
	// 		"923422685541851196",
	// 		"1185033301099020311",
	// 		"956887823024275487",
	// 		"928586086828085358",
	// 		"928355373763674162",
	// 		"1171204995392209047",
	// 		"1185045242706153573",
	// 		"956092289552384010",
	// 		"1185034487537606676",
	// 		"932057102841708655",
	// 		"1185018638567231562",
	// 		"1185038257789079614",
	// 		"1185045519576338442",
	// 		"928600396002373633",
	// 		"956294250927120436",
	// 		"1171197414632341508",
	// 		"956172424309784617",
	// 		"1185045420594974761",
	// 		"956323664062722100",
	// 		"1171191966059466802",
	// 		"932094826059563040",
	// 		"1185043970150117467",
	// 		"1210174835985088532",
	// 		"932070704042631219",
	// 		"956157904539512874",
	// 		"932039160854872084"
	// 	];
		
	// 	(async () => {
	// 		const guild = await client.guilds.fetch('865737627712749579');
				
	// 		for (const userId of botAccounts) {
	// 			await guild.members.ban(userId, { reason: 'spy.pet bot account' });
	// 		}
	// 	})();
	// }

	public override async run(client: Client) {
		this.statusInverval(client);
	}
}
