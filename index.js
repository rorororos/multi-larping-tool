(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/Settings.jsx
  var Settings_exports = {};
  __export(Settings_exports, {
    default: () => Settings
  });
  function Settings() {
    (0, import_storage.useProxy)(import_plugin.storage);
    const [captureId, setCaptureId] = import_common.React.useState("");
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollView, { style: { flex: 1 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, { title: "\u270F\uFE0F fake name (only u see btw)", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          FormInput,
          {
            title: "display name",
            value: import_plugin.storage.displayName || "",
            placeholder: "ur fake display name",
            onChange: (v) => {
              import_plugin.storage.displayName = v;
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormDivider, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          FormInput,
          {
            title: "username",
            value: import_plugin.storage.username || "",
            placeholder: "urfakeuser",
            onChange: (v) => {
              import_plugin.storage.username = v;
            }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSection, { title: "\u{1F4C5} fake member since", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FormInput,
        {
          title: "date (YYYY-MM-DD)",
          value: import_plugin.storage.fakeCreatedAt || "",
          placeholder: "2015-05-13",
          onChange: (v) => {
            import_plugin.storage.fakeCreatedAt = v;
          }
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, { title: "\u{1F3AF} snag from user id", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          FormInput,
          {
            title: "user id",
            value: captureId,
            placeholder: "paste user id here...",
            onChange: setCaptureId
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          FormRow,
          {
            label: "\u{1F3AF} snag their badges",
            onPress: () => {
              if (!captureId || !/^\d{17,20}$/.test(captureId)) {
                (0, import_toasts.showToast)("thats not a valid id lol", { type: 2 });
                return;
              }
              captureFromUserId(captureId);
            }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSection, { title: "\u{1F3C5} fake badges", children: Object.entries(BADGES_CATALOG).map(([key, badge]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_common.React.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          FormRow,
          {
            label: badge.description,
            trailing: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              FormSwitch,
              {
                value: import_plugin.storage.activeBadges.includes(key),
                onValueChange: (v) => {
                  if (v) {
                    import_plugin.storage.activeBadges = [...import_plugin.storage.activeBadges, key];
                  } else {
                    import_plugin.storage.activeBadges = import_plugin.storage.activeBadges.filter((k) => k !== key);
                  }
                }
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormDivider, {})
      ] }, key)) })
    ] });
  }
  var import_common, import_plugin, import_storage, import_components, import_toasts, import_jsx_runtime, ScrollView, View, TextInput, FormSection, FormRow, FormSwitch, FormInput, FormDivider;
  var init_Settings = __esm({
    "src/Settings.jsx"() {
      import_common = __require("@vendetta/metro/common");
      import_plugin = __require("@vendetta/plugin");
      import_storage = __require("@vendetta/storage");
      import_components = __require("@vendetta/ui/components");
      import_toasts = __require("@vendetta/ui/toasts");
      init_src();
      import_jsx_runtime = __require("react/jsx-runtime");
      ({ ScrollView, View, TextInput } = import_common.ReactNative);
      ({ FormSection, FormRow, FormSwitch, FormInput, FormDivider } = import_components.Forms);
    }
  });

  // src/index.js
  function modifyUser(user) {
    if (import_plugin2.storage.displayName)
      user.globalName = import_plugin2.storage.displayName;
    if (import_plugin2.storage.username)
      user.username = import_plugin2.storage.username;
    if (import_plugin2.storage.fakeCreatedAt) {
      try {
        const fakeDate = new Date(import_plugin2.storage.fakeCreatedAt);
        if (!isNaN(fakeDate.getTime())) {
          Object.defineProperty(user, "createdAt", {
            get: () => fakeDate,
            configurable: true
          });
        }
      } catch {
      }
    }
  }
  function captureFromUserId(targetId) {
    try {
      const user = UserStore.getUser(targetId);
      const profile = UserProfileStore.getUserProfile(targetId);
      if (!user && !profile) {
        (0, import_toasts2.showToast)("user not cached lol, open their profile first", { type: 2 });
        return 0;
      }
      let added = 0;
      const theirBadges = profile?.badges || [];
      for (const badge of theirBadges) {
        const key = Object.keys(BADGES_CATALOG).find((k) => BADGES_CATALOG[k].id === badge.id);
        if (key && !import_plugin2.storage.activeBadges.includes(key)) {
          import_plugin2.storage.activeBadges.push(key);
          added++;
        }
      }
      (0, import_toasts2.showToast)(`snagged ${added} badge${added !== 1 ? "s" : ""} from ${user?.username || targetId}`, { type: 1 });
      return added;
    } catch (e) {
      console.error(e);
      (0, import_toasts2.showToast)("something broke lol", { type: 2 });
      return 0;
    }
  }
  var import_metro, import_patcher, import_plugin2, import_toasts2, BADGES_CATALOG, UserStore, UserProfileStore, userId, patches, src_default;
  var init_src = __esm({
    "src/index.js"() {
      import_metro = __require("@vendetta/metro");
      import_patcher = __require("@vendetta/patcher");
      import_plugin2 = __require("@vendetta/plugin");
      import_toasts2 = __require("@vendetta/ui/toasts");
      BADGES_CATALOG = {
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
        orb_profile_badge: { id: "orb_profile_badge", description: "Collected the Orb Profile Badge", icon: "83d8a1eb09a8d64e59233eec5d4d5c2d" }
      };
      import_plugin2.storage.activeBadges ??= [];
      import_plugin2.storage.hiddenBadges ??= [];
      import_plugin2.storage.displayName ??= "";
      import_plugin2.storage.username ??= "";
      import_plugin2.storage.fakeCreatedAt ??= "";
      UserStore = (0, import_metro.findByStoreName)("UserStore");
      UserProfileStore = (0, import_metro.findByStoreName)("UserProfileStore");
      userId = null;
      patches = [];
      src_default = {
        onLoad: () => {
          try {
            userId = UserStore.getCurrentUser()?.id;
            if (!userId) {
              console.log("[MultiLarpingTool] no user id lol");
              return;
            }
            patches.push((0, import_patcher.after)("getUserProfile", UserProfileStore, (args, profile) => {
              if (!profile || args[0] !== userId)
                return;
              profile.badges ??= [];
              if (import_plugin2.storage.hiddenBadges.length > 0) {
                profile.badges = profile.badges.filter((b) => !import_plugin2.storage.hiddenBadges.includes(b.id));
              }
              const existing = new Set(profile.badges.map((b) => b.id));
              for (const key of import_plugin2.storage.activeBadges) {
                const badge = BADGES_CATALOG[key];
                if (badge && !existing.has(badge.id)) {
                  profile.badges.push(badge);
                }
              }
            }));
            patches.push((0, import_patcher.after)("getCurrentUser", UserStore, (args, user) => {
              if (!user || user.id !== userId)
                return;
              modifyUser(user);
            }));
            patches.push((0, import_patcher.after)("getUser", UserStore, (args, user) => {
              if (!user || args[0] !== userId)
                return;
              modifyUser(user);
            }));
            console.log("[MultiLarpingTool] loaded btw");
          } catch (e) {
            console.error("[MultiLarpingTool] load error:", e);
          }
        },
        onUnload: () => {
          for (const unpatch of patches)
            unpatch();
          patches.length = 0;
          console.log("[MultiLarpingTool] unloaded");
        },
        settings: (init_Settings(), __toCommonJS(Settings_exports)).default
      };
    }
  });
  init_src();
})();
