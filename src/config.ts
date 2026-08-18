/**
 * 全局配置
 *
 * 网站的全局信息统一放在这里。
 */
export const siteConfig = {
  site: {
    title: "boxueduocai - 后来烟雨皆散尽，无人撑伞一人行",
    heroTitle: "boxueduocai's Blog",
    heroSubtitle: "后来烟雨皆散尽，无人撑伞一人行",
    footerText: "© 2026 boxueduocai. 保留部分权利。",
    language: "zh-CN",

    author: {
      name: "boxueduocai",
      avatar: "https://github.com/boxueduocai666.png",
      description: "后来烟雨皆散尽，无人撑伞一人行",
    },
  },

  appearance: {
    backgroundImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",

    glass: {
      opacity: 0.08,
      blur: 28,
      refractiveIndex: 1.33,
      border: "rgba(255, 255, 255, 0.45)",
    },

    colors: {
      textPrimary: "#0f172a",
      textSecondary: "#334155",
      accent: "#0284c7",
      accentLight: "#38bdf8",
      likeRed: "#f43f5e",
    },

    animation: {
      time: 420,
      commentTime: 560,
    },
  },

  music: {
    defaultTrackIndex: 0,
  },
  twikoo: {
    enable: true,

    envId:
    "https://kwitoo-bxdc.vercel.app/"
},
} as const;



export type SiteConfig = typeof siteConfig;