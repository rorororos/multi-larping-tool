import { findByStoreName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import Settings from "./Settings";

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

if (!storage.activeBadges) storage.activeBadges = [];
if (!storage.hiddenBadges) storage.hiddenBadges = [];
if (!storage.displayName) storage.displayName = "";
if (!storage.username) storage.username = "";
if (!storage.fakeCreatedAt) storage.fakeCreatedAt = "";

const patches = [];
let userId = null;

function modifyUser(user) {
    try {
        if (storage.displayName) user.globalName = storage.displayName;
        if (storage.username) user.username = storage.username;
    } catch (e) {}
}

export const BADGES = BADGES_CATALOG;

export function captureFromUserId(targetId) {
    try {
        const UserStore = findByStoreName("UserStore");
        const UserProfileStore = findByStoreName("UserProfileStore");
        const user = UserStore.getUser(targetId);
        const profile = UserProfileStore.getUserProfile(targetId);

        if (!user && !profile) {
            showToast("user not cached, open their profile first lol", { type: 2 });
            return;
        }

        let added = 0;
        const theirBadges = (profile && profile.badges) || [];

        for (const badge of theirBadges) {
            const key = Object.keys(BADGES_CATALOG).find(k => BADGES_CATALOG[k].id === badge.id);
            if (key && !storage.activeBadges.includes(key)) {
                storage.activeBadges.push(key);
                added++;
            }
        }

        const name = (user && user.username) || targetId;
        showToast(`snagged ${added} badge${added !== 1 ? "s" : ""} from ${name}`, { type: 1 });
    } catch (e) {
        console.log("[MultiLarpingTool] capture error:", e);
        showToast("something broke lol", { type: 2 });
    }
}

export const onLoad = () => {
    try {
        const UserStore = findByStoreName("UserStore");
        const UserProfileStore = findByStoreName("UserProfileStore");

        const currentUser = UserStore.getCurrentUser();
        if (!currentUser) {
            console.log("[MultiLarpingTool] no current user");
            return;
        }
        userId = currentUser.id;

        patches.push(after("getUserProfile", UserProfileStore, ([id], profile) => {
            if (!profile || id !== userId) return profile;
            if (!profile.badges) profile.badges = [];

            if (storage.hiddenBadges.length > 0) {
                profile.badges = profile.badges.filter(b => !storage.hiddenBadges.includes(b.id));
            }

            const existing = new Set(profile.badges.map(b => b.id));
            for (const key of storage.activeBadges) {
                const badge = BADGES_CATALOG[key];
                if (badge && !existing.has(badge.id)) {
                    profile.badges.push(badge);
                }
            }

            return profile;
        }));

        patches.push(after("getCurrentUser", UserStore, (args, user) => {
            if (!user || user.id !== userId) return;
            modifyUser(user);
        }));

        patches.push(after("getUser", UserStore, ([id], user) => {
            if (!user || id !== userId) return;
            modifyUser(user);
        }));

        console.log("[MultiLarpingTool] loaded btw");
    } catch (e) {
        console.log("[MultiLarpingTool] load error:", e);
    }
};

export const onUnload = () => {
    for (const unpatch of patches) {
        try { unpatch(); } catch {}
    }
    patches.length = 0;
};

export const settings = Settings;
