import { findByStoreName, findByProps } from "@vendetta/metro";
import { before, after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";

const BADGES_CATALOG = {
    staff: { id: "staff", description: "Discord Staff", icon: "5e74e9b61934fc1f67c65515d1f7e60d" },
    partner: { id: "partner", description: "Partnered Server Owner", icon: "3f9748e53446a137a052f3454e2de41e" },
    certified_moderator: { id: "certified_moderator", description: "Moderator Programs Alumni", icon: "fee1624003e2fee35cb398e125dc479b" },
    bug_hunter_level_1: { id: "bug_hunter_level_1", description: "Discord Bug Hunter", icon: "2717692c7dca7289b35297368a940dd0" },
    bug_hunter_level_2: { id: "bug_hunter_level_2", description: "Discord Bug Hunter", icon: "848f79194d4be5ff5f81505cbd0ce1e6" },
    verified_developer: { id: "verified_developer", description: "Early Verified Bot Developer", icon: "6df5892e0f35b051f8b61eace34f4967" },
    early_supporter: { id: "early_supporter", description: "Early Supporter", icon: "7060786766c9c840eb3019e725d2b358" },
    legacy_username: { id: "legacy_username", description: "Legacy Username", icon: "6de6d34650760ba5551a79732e98ed60" },
    hypesquad: { id: "hypesquad", description: "HypeSquad Events", icon: "bf01d1073931f921909045f3a39fd264" },
    hypesquad_bravery: { id: "hypesquad_house_1", description: "HypeSquad Bravery", icon: "8a88d63823d8a71cd5e390baa45efa02" },
    hypesquad_brilliance: { id: "hypesquad_house_2", description: "HypeSquad Brilliance", icon: "011940fd013da3f7fb926e4a1cd2e618" },
    hypesquad_balance: { id: "hypesquad_house_3", description: "HypeSquad Balance", icon: "3aa41de486fa12454c3761e8e223442e" },
    premium: { id: "premium", description: "Nitro Subscriber", icon: "2ba85e8026a8614b640c2837bcdfe21b" },
    premium_tenure_12_month_v2: { id: "premium_tenure_12_month_v2", description: "Nitro 12 Months", icon: "0334688279c8359120922938dcb1d6f8" },
    premium_tenure_24_month_v2: { id: "premium_tenure_24_month_v2", description: "Nitro 24 Months", icon: "0d61871f72bb9a33a7ae568c1fb4f20a" },
    premium_tenure_36_month_v2: { id: "premium_tenure_36_month_v2", description: "Nitro 36 Months", icon: "11e2d339068b55d3a506cff34d3780f3" },
    premium_tenure_60_month_v2: { id: "premium_tenure_60_month_v2", description: "Nitro 60 Months", icon: "cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4" },
    premium_tenure_72_month_v2: { id: "premium_tenure_72_month_v2", description: "Nitro 72 Months", icon: "5b154df19c53dce2af92c9b61e6be5e2" },
    guild_booster_lvl1: { id: "guild_booster_lvl1", description: "Server Booster Level 1", icon: "51040c70d4f20a921ad6674ff86fc95c" },
    guild_booster_lvl9: { id: "guild_booster_lvl9", description: "Server Booster Level 9", icon: "ec92202290b48d0879b7413d2dde3bab" },
    quest_completed: { id: "quest_completed", description: "Completed a Quest", icon: "7d9ae358c8c5e118768335dbe68b4fb8" },
    orb_profile_badge: { id: "orb_profile_badge", description: "Collected the Orb Profile Badge", icon: "83d8a1eb09a8d64e59233eec5d4d5c2d" },
};

// defaults
storage.activeBadges ??= [];
storage.hiddenBadges ??= [];
storage.displayName ??= "";
storage.username ??= "";
storage.fakeCreatedAt ??= "";

const UserStore = findByStoreName("UserStore");
const UserProfileStore = findByStoreName("UserProfileStore");

let userId = null;
const patches = [];

export default {
    onLoad: () => {
        try {
            userId = UserStore.getCurrentUser()?.id;
            if (!userId) {
                console.log("[MultiLarpingTool] no user id lol");
                return;
            }

            // patch profile pra adicionar/esconder badges
            patches.push(after("getUserProfile", UserProfileStore, (args, profile) => {
                if (!profile || args[0] !== userId) return;
                profile.badges ??= [];

                // esconde badges hidden
                if (storage.hiddenBadges.length > 0) {
                    profile.badges = profile.badges.filter(b => !storage.hiddenBadges.includes(b.id));
                }

                // adiciona badges fake
                const existing = new Set(profile.badges.map(b => b.id));
                for (const key of storage.activeBadges) {
                    const badge = BADGES_CATALOG[key];
                    if (badge && !existing.has(badge.id)) {
                        profile.badges.push(badge);
                    }
                }
            }));

            // patch user pra mudar nome
            patches.push(after("getCurrentUser", UserStore, (args, user) => {
                if (!user || user.id !== userId) return;
                modifyUser(user);
            }));

            patches.push(after("getUser", UserStore, (args, user) => {
                if (!user || args[0] !== userId) return;
                modifyUser(user);
            }));

            console.log("[MultiLarpingTool] loaded btw");
        } catch (e) {
            console.error("[MultiLarpingTool] load error:", e);
        }
    },

    onUnload: () => {
        for (const unpatch of patches) unpatch();
        patches.length = 0;
        console.log("[MultiLarpingTool] unloaded");
    },

    settings: require("./Settings").default
};

function modifyUser(user) {
    if (storage.displayName) user.globalName = storage.displayName;
    if (storage.username) user.username = storage.username;

    if (storage.fakeCreatedAt) {
        try {
            const fakeDate = new Date(storage.fakeCreatedAt);
            if (!isNaN(fakeDate.getTime())) {
                Object.defineProperty(user, "createdAt", {
                    get: () => fakeDate,
                    configurable: true
                });
            }
        } catch {}
    }
}

export function captureFromUserId(targetId) {
    try {
        const user = UserStore.getUser(targetId);
        const profile = UserProfileStore.getUserProfile(targetId);

        if (!user && !profile) {
            showToast("user not cached lol, open their profile first", { type: 2 });
            return 0;
        }

        let added = 0;
        const theirBadges = profile?.badges || [];

        for (const badge of theirBadges) {
            const key = Object.keys(BADGES_CATALOG).find(k => BADGES_CATALOG[k].id === badge.id);
            if (key && !storage.activeBadges.includes(key)) {
                storage.activeBadges.push(key);
                added++;
            }
        }

        showToast(`snagged ${added} badge${added !== 1 ? "s" : ""} from ${user?.username || targetId}`, { type: 1 });
        return added;
    } catch (e) {
        console.error(e);
        showToast("something broke lol", { type: 2 });
        return 0;
    }
}

export { BADGES_CATALOG };
