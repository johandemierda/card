const userID = "738748102311280681"; // Change this to your Discord user ID

const elements = {
	statusBox: document.getElementById("status"),
	statusImage: document.getElementById("status-image"),
	avatarImage: document.getElementById("avatar-image"),
	bannerImage: document.getElementById("banner-image"),
	bannerColor: document.querySelector(".banner"),
	displayName: document.querySelector(".display-name"),
	username: document.querySelector(".username"),
	badges: document.querySelector(".badges-left"),
	customStatus: document.querySelector(".custom-status"),
	customStatusText: document.querySelector(".custom-status-text"),
	customStatusEmoji: document.getElementById("custom-status-emoji"),
};

async function fetchDiscordStatus() {
	try {
		const [lanyardResponse, lookupResponse] = await Promise.all([
			fetch(`https://api.lanyard.rest/v1/users/${userID}`).then((response) =>
				response.json()
			),
			fetch(`https://discordlookup.mesavirep.xyz/v1/user/${userID}`).then(
				(response) => response.json()
			),
		]);

		const lanyardData = lanyardResponse.data;
		const lookupData = lookupResponse;

		const { discord_status, activities, discord_user, emoji } = lanyardData;
		const { avatar, banner, badges: userBadges, global_name, tag } = lookupData;

		elements.displayName.innerHTML = discord_user.display_name;
		elements.username.innerHTML = discord_user.username;

		let imagePath;
		switch (discord_status) {
			case "online":
				imagePath = "./public/status/online.svg";
				break;
			case "idle":
				imagePath = "./public/status/idle.svg";
				break;
			case "dnd":
				imagePath = "./public/status/dnd.svg";
				break;
			case "offline":
				imagePath = "./public/status/offline.svg";
				break;
			default:
				imagePath = "./public/status/offline.svg";
				break;
		}

		if (
			activities.find(
				(activity) =>
					activity.type === 1 &&
					(activity.url.includes("twitch.tv") ||
						activity.url.includes("youtube.com"))
			)
		) {
			imagePath = "./public/status/streaming.svg";
		}

		if (banner.id == null) {
			elements.bannerImage.src =
				"https://cdn.discordapp.com/attachments/1104468941012746240/1162045939310145558/95202766_p0.webp";
		} else {
			elements.bannerImage.src = `https://cdn.discordapp.com/banners/${discord_user.id}/${banner.id}?format=webp&size=1024`;
			elements.bannerImage.alt = `Discord banner: ${discord_user.username}`;
		}

		elements.statusImage.src = imagePath;
		elements.statusImage.alt = `Discord status: ${discord_status}`;
		elements.bannerColor.style.backgroundColor = banner.color;
		elements.avatarImage.src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${avatar.id}?format=webp&size=1024`;
		elements.avatarImage.alt = `Discord avatar: ${discord_user.username}`;

		elements.customStatusText.innerHTML =
			activities[0].state != null ? activities[0].state : "Not doing anything!";

		if (activities[0].emoji == null) {
			elements.customStatusEmoji.style.display = "none";
		} else {
			elements.customStatusEmoji.src = `https://cdn.discordapp.com/emojis/${activities[0].emoji.id}?format=webp&size=24&quality=lossless`;
			elements.customStatusEmoji.style.marginRight = "5px";
		}

		if (activities[0].state == null && activities[0].emoji == null) {
			elements.customStatus.style.display = "none";
			elements.customStatusEmoji.style.display = "none";
			elements.customStatusText.style.display = "none";
			elements.customStatus.removeAttribute("style");
			elements.customStatusEmoji.removeAttribute("style");
			elements.customStatusText.removeAttribute("style");
		} else {
			elements.customStatus.style.display = "flex";
		}
	} catch (error) {
		console.error("Unable to retrieve Discord status:", error);
	}
}

// Mapping badges to their respective images
const badgeMappings = {
	HOUSE_BRILLIANCE: "./public/badges/hypesquad-brilliance.svg",
	ACTIVE_DEVELOPER: "./public/badges/active-developer.svg",
	HOUSE_BRAVERY: "./public/badges/hypesquad-bravery.svg",
	HOUSE_BALANCE: "./public/badges/hypesquad-balance.svg",
	EARLY_SUPPORTER: "./public/badges/early-supporter.svg",
	EARLY_VERIFIED_BOT_DEVELOPER:
		"./public/badges/early-verified-bot-developer.svg",
	PARTNERED_SERVER_OWNER: "./public/badges/discord-partner.svg",
	LEGACY_USER: "./public/badges/legacy-username.svg",
	NITRO: "./public/badges/nitro.svg",
};

// Logic for tooltips
const tooltips = document.querySelectorAll(".tooltip");
tooltips.forEach((tooltip) => {
	tooltip.addEventListener("mouseenter", () => {
		const ariaLabel = tooltip.getAttribute("aria-label");
		tooltip.setAttribute("data-tooltip-content", ariaLabel);
	});

	tooltip.addEventListener("mouseleave", () => {
		tooltip.removeAttribute("data-tooltip-content");
	});
});

// const links = document.querySelectorAll("a");

// links.forEach((link) => {
// 	const href = link.getAttribute("href");
// 	link.setAttribute("title", href);
// });

const anchors = document.getElementsByTagName("a");

for (let i = 0; i < anchors.length; i++) {
	const anchor = anchors[i];
	const href = anchor.getAttribute("href");
	if (href) {
		anchor.setAttribute("title", href);
	}
}

// Fetch Discord status on page load
fetchDiscordStatus();
// Fetch Discord status every 6 seconds
setInterval(fetchDiscordStatus, 6000);
