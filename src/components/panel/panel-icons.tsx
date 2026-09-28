"use client";

import React from "react";
import { Key as PhosphorKey } from "@phosphor-icons/react/dist/ssr";

export type PanelIconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function make(name: string, node: React.ReactNode) {
  const C: React.FC<PanelIconProps> = ({ size = 16, className, strokeWidth = 1.5 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {node}
    </svg>
  );
  C.displayName = name;
  return C;
}

export const IcSearch = make("IcSearch", (
  <>
    <circle cx="7" cy="7" r="4.4" />
    <path d="M10.3 10.3 14 14" />
  </>
));

export const IcHome = make("IcHome", (
  <>
    <path d="M2.6 6.7 8 2.2l5.4 4.5V13a1.1 1.1 0 0 1-1.1 1.1H3.7A1.1 1.1 0 0 1 2.6 13V6.7Z" />
    <path d="M6.4 14v-4.3h3.2V14" />
  </>
));

export const IcClock = make("IcClock", (
  <>
    <circle cx="8" cy="8" r="5.7" />
    <path d="M8 4.9V8l2.2 1.4" />
  </>
));

export const IcHistory = make("IcHistory", (
  <>
    <path d="M2.9 8a5.1 5.1 0 1 1 1.5 3.6" />
    <path d="M2.7 5.9v2.4h2.4" />
    <path d="M8 5.5V8l1.9 1.2" />
  </>
));

export const IcGrid = make("IcGrid", (
  <>
    <rect x="2.4" y="2.4" width="4.7" height="4.7" rx="1" />
    <rect x="8.9" y="2.4" width="4.7" height="4.7" rx="1" />
    <rect x="2.4" y="8.9" width="4.7" height="4.7" rx="1" />
    <rect x="8.9" y="8.9" width="4.7" height="4.7" rx="1" />
  </>
));

export const IcGlobe = make("IcGlobe", (
  <>
    <circle cx="8" cy="8" r="5.7" />
    <path d="M8 2.3c2.1 1.7 2.1 9.7 0 11.4-2.1-1.7-2.1-9.7 0-11.4Z" />
    <path d="M2.7 6.1h10.6M2.7 9.9h10.6" />
  </>
));

export const IcChevronRight = make("IcChevronRight", (
  <path d="m6.1 3.9 4.1 4.1-4.1 4.1" />
));

export const IcChevronDown = make("IcChevronDown", (
  <path d="m3.9 6.1 4.1 4.1 4.1-4.1" />
));

export const IcChevronUpDown = make("IcChevronUpDown", (
  <>
    <path d="m5.1 6 2.9-2.9L10.9 6" />
    <path d="m5.1 10 2.9 2.9 2.9-2.9" />
  </>
));

export const IcArrowUpRight = make("IcArrowUpRight", (
  <>
    <path d="M4.7 11.3 11.3 4.7" />
    <path d="M6.1 4.7h5.2v5.2" />
  </>
));

export const IcArrowLeft = make("IcArrowLeft", (
  <>
    <path d="M13.2 8H2.8" />
    <path d="M7 3.8 2.8 8 7 12.2" />
  </>
));

export const IcArrowRight = make("IcArrowRight", (
  <>
    <path d="M2.8 8h10.4" />
    <path d="M9 3.8 13.2 8 9 12.2" />
  </>
));

export const IcPanelLeft = make("IcPanelLeft", (
  <>
    <rect x="2" y="2.9" width="12" height="10.2" rx="1.5" />
    <path d="M6.1 2.9v10.2" />
  </>
));

export const IcClose = make("IcClose", (
  <path d="m4.2 4.2 7.6 7.6M11.8 4.2l-7.6 7.6" />
));

export const IcPlus = make("IcPlus", (
  <path d="M8 3.3v9.4M3.3 8h9.4" />
));

export const IcEllipsis = make("IcEllipsis", (
  <>
    <circle cx="3.4" cy="8" r="1" fill="currentColor" stroke="none" />
    <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
    <circle cx="12.6" cy="8" r="1" fill="currentColor" stroke="none" />
  </>
));

export const IcRefresh = make("IcRefresh", (
  <>
    <path d="M13.3 8A5.3 5.3 0 1 1 11.7 4.2" />
    <path d="M13.5 2v2.7h-2.7" />
  </>
));

export const IcCalendar = make("IcCalendar", (
  <>
    <rect x="2.3" y="3.2" width="11.4" height="10.4" rx="1.4" />
    <path d="M2.3 6.5h11.4" />
    <path d="M5.3 1.8v2.7M10.7 1.8v2.7" />
  </>
));

export const IcUsers = make("IcUsers", (
  <>
    <circle cx="5.6" cy="5.1" r="2.4" />
    <path d="M1.9 13.2c.3-2.2 1.9-3.5 3.7-3.5s3.4 1.3 3.7 3.5" />
    <path d="M10.1 3a2.1 2.1 0 0 1 0 4.1" />
    <path d="M11.3 9.9c1.6.3 2.7 1.4 2.9 3.1" />
  </>
));

export const IcUser = make("IcUser", (
  <>
    <circle cx="8" cy="5" r="2.6" />
    <path d="M3.3 13.6c.4-2.5 2.4-3.9 4.7-3.9s4.3 1.4 4.7 3.9" />
  </>
));

export const IcBell = make("IcBell", (
  <>
    <path d="M8 2a4.1 4.1 0 0 1 4.1 4.1c0 2.5.6 3.5 1.2 4.2H2.7c.6-.7 1.2-1.7 1.2-4.2A4.1 4.1 0 0 1 8 2Z" />
    <path d="M6.7 13.3a1.4 1.4 0 0 0 2.6 0" />
  </>
));

export const IcKey = make("IcKey", (
  <>
    <circle cx="5" cy="11" r="2.7" />
    <path d="m7 9 6.3-6.3" />
    <path d="m10.7 5.3 2 2" />
  </>
));

export const IcKeyRound = make("IcKeyRound", (
  <>
    <circle cx="5.2" cy="10.8" r="3.5" />
    <path d="m7.7 8.3 6.1-6.1" />
    <path d="m10.6 5.4 1.9 1.9" />
    <path d="m12.4 3.6 1.5 1.5" />
  </>
));

export const IcDownload = make("IcDownload", (
  <>
    <path d="M8 2.5v7.6" />
    <path d="M4.8 7 8 10.1 11.2 7" />
    <path d="M2.9 13.4h10.2" />
  </>
));

export const IcBook = make("IcBook", (
  <>
    <path d="M8 3.5C6.6 2.4 4.7 2.1 2.7 2.3V13c2-.2 3.9 0 5.3 1.1 1.4-1.1 3.3-1.3 5.3-1.1V2.3c-2-.2-3.9.1-5.3 1.2Z" />
    <path d="M8 3.5V14" />
  </>
));

export const IcChat = make("IcChat", (
  <>
    <path d="M13.6 7.8c0 2.9-2.5 5.1-5.6 5.1-.9 0-1.7-.2-2.4-.5l-3.2 1 1-2.7c-.6-.8-1-1.8-1-2.9C2.4 4.9 4.9 2.7 8 2.7s5.6 2.2 5.6 5.1Z" />
  </>
));
export const IcDiscord: React.FC<PanelIconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    focusable="false"
    style={{ opacity: 0.92 }}
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);
IcDiscord.displayName = "IcDiscord";

export const IcKeyDuotone: React.FC<PanelIconProps> = ({ size = 16, className }) => (
  <PhosphorKey
    weight="duotone"
    size={Math.round(size * 1.1)}
    className={className}
    aria-hidden="true"
  />
);
IcKeyDuotone.displayName = "IcKeyDuotone";

export const IcGift = make("IcGift", (
  <>
    <path d="M2.9 7.9h10.2v5.1a1.1 1.1 0 0 1-1.1 1.1H4a1.1 1.1 0 0 1-1.1-1.1V7.9Z" />
    <rect x="2.2" y="5" width="11.6" height="2.9" rx="0.6" />
    <path d="M8 5v9.1" />
    <path d="M8 4.8C8 3.1 6.9 1.9 5.7 2.2c-1.2.3-1.1 2.2 2.3 2.6Z" />
    <path d="M8 4.8c0-1.7 1.1-2.9 2.3-2.6 1.2.3 1.1 2.2-2.3 2.6Z" />
  </>
));

export const IcBulb = make("IcBulb", (
  <>
    <path d="M5.5 11.1C4.1 10.2 3.3 8.8 3.3 7.2a4.7 4.7 0 0 1 9.4 0c0 1.6-.8 3-2.2 3.9v1.3H5.5v-1.3Z" />
    <path d="M6.1 14.1h3.8" />
  </>
));

export const IcGear = make("IcGear", (
  <>
    <circle cx="8" cy="8" r="3.2" />
    <path d="M8 1.7v1.8M8 12.5v1.8M1.7 8h1.8M12.5 8h1.8M3.5 3.5l1.3 1.3M11.2 11.2l1.3 1.3M12.5 3.5l-1.3 1.3M4.8 11.2l-1.3 1.3" />
  </>
));

export const IcShield = make("IcShield", (
  <path d="M8 1.9 13.2 3.8v4.1c0 3.1-2 5.1-5.2 6.3-3.2-1.2-5.2-3.2-5.2-6.3V3.8L8 1.9Z" />
));

export const IcShieldCheck = make("IcShieldCheck", (
  <>
    <path d="M8 1.9 13.2 3.8v4.1c0 3.1-2 5.1-5.2 6.3-3.2-1.2-5.2-3.2-5.2-6.3V3.8L8 1.9Z" />
    <path d="m5.8 7.9 1.6 1.6 2.9-3.1" />
  </>
));

export const IcBan = make("IcBan", (
  <>
    <circle cx="8" cy="8" r="5.7" />
    <path d="M4 4l8 8" />
  </>
));

export const IcPulse = make("IcPulse", (
  <path d="M1.9 8.2h2.5L6 4.7l3.3 6.8 1.7-3.3h3.1" />
));

export const IcLogs = make("IcLogs", (
  <>
    <rect x="3.2" y="2.3" width="9.6" height="11.4" rx="1.2" />
    <path d="M5.6 5.4h4.8M5.6 8h4.8M5.6 10.6h3" />
  </>
));

export const IcDatabase = make("IcDatabase", (
  <>
    <ellipse cx="8" cy="3.7" rx="5.3" ry="1.9" />
    <path d="M2.7 3.7v8.6c0 1 2.4 1.9 5.3 1.9s5.3-.9 5.3-1.9V3.7" />
    <path d="M2.7 8c0 1 2.4 1.9 5.3 1.9S13.3 9 13.3 8" />
  </>
));

export const IcClipboard = make("IcClipboard", (
  <>
    <rect x="3.7" y="3.1" width="8.6" height="11" rx="1.2" />
    <rect x="6" y="1.8" width="4" height="2.6" rx="0.8" />
    <path d="M6 7.4h4M6 10h2.7" />
  </>
));

export const IcFile = make("IcFile", (
  <>
    <path d="M4.1 1.9h5.2l2.6 2.8v9.4H4.1V1.9Z" />
    <path d="M9.3 1.9v2.8h2.6" />
    <path d="M6 8h4M6 10.6h2.6" />
  </>
));

export const IcBolt = make("IcBolt", (
  <path d="M8.9 1.8 3.6 9h3.3l-1 5.2L11.3 7H8l.9-5.2Z" />
));

export const IcCard = make("IcCard", (
  <>
    <rect x="1.9" y="3.4" width="12.2" height="9.2" rx="1.4" />
    <path d="M1.9 6.3h12.2" />
    <path d="M4.2 9.8h2.6" />
  </>
));

export const IcStore = make("IcStore", (
  <>
    <path d="M2.4 5.7 3.4 2.5h9.2l1 3.2c0 1-.8 1.9-1.9 1.9-1 0-1.8-.7-1.9-1.6-.2.9-1 1.6-1.9 1.6s-1.7-.7-1.9-1.6c-.1.9-.9 1.6-1.9 1.6-1 0-1.7-.9-1.7-1.9Z" />
    <path d="M3.3 7.5v6h9.4v-6" />
    <path d="M6.5 13.5v-3h3v3" />
  </>
));

export const IcAlert = make("IcAlert", (
  <>
    <path d="M7.1 2.7 1.6 12.4a1 1 0 0 0 .9 1.5h11a1 1 0 0 0 .9-1.5L8.9 2.7a1 1 0 0 0-1.8 0Z" />
    <path d="M8 6.2v3.2" />
    <circle cx="8" cy="11.6" r="0.4" fill="currentColor" stroke="none" />
  </>
));

export const IcFingerprint = make("IcFingerprint", (
  <>
    <path d="M3.6 5.1A5.3 5.3 0 0 1 8 2.8c1.8 0 3.4.9 4.4 2.3" />
    <path d="M2.7 9.8c-.2-1.2-.1-2.2.2-3.1" />
    <path d="M13.3 6.7c.3.9.4 2 .2 3.3-.1.9-.4 1.9-.8 2.8" />
    <path d="M5.1 12.9c-.5-.9-.8-1.9-.8-3.4A3.7 3.7 0 0 1 8 5.9c2 0 3.7 1.6 3.7 3.6 0 .8-.1 1.6-.3 2.3" />
    <path d="M8 8.9c0 1.9.4 3.5 1.2 4.9" />
  </>
));

export const IcCode = make("IcCode", (
  <>
    <path d="M5.3 4.7 2 8l3.3 3.3" />
    <path d="M10.7 4.7 14 8l-3.3 3.3" />
  </>
));

export const IcSparkle = make("IcSparkle", (
  <>
    <path d="M8 1.9c.4 3 1.7 4.5 4.9 5.1-3.2.6-4.5 2.1-4.9 5.1-.4-3-1.7-4.5-4.9-5.1 3.2-.6 4.5-2.1 4.9-5.1Z" />
    <path d="M12.8 10.7c.2 1.4.8 2.1 2.2 2.3-1.4.2-2 .9-2.2 2.3-.2-1.4-.8-2.1-2.2-2.3 1.4-.2 2-.9 2.2-2.3Z" />
  </>
));

export const IcHelp = make("IcHelp", (
  <>
    <circle cx="8" cy="8" r="5.7" />
    <path d="M6.2 6.2A1.9 1.9 0 0 1 9.9 6.8c0 1.2-1.9 1.4-1.9 2.6" />
    <circle cx="8" cy="11.4" r="0.4" fill="currentColor" stroke="none" />
  </>
));

export const IcRocket = make("IcRocket", (
  <>
    <path d="M9.4 2.9c1.9-.8 3.2-.7 3.7-.6.1.5.2 1.8-.6 3.7-.8 1.9-2.3 3.7-4.3 5.1L6 12.2 3.8 10l1.1-2.2c1.4-2 3.2-3.5 4.5-4.9Z" />
    <circle cx="10.1" cy="5.9" r="1" />
    <path d="M4.6 11.4c-1 .3-1.8 1.1-2.1 2.5 1.4-.3 2.2-1.1 2.5-2.1" />
    <path d="M5.3 7.6c-1.2-.1-2.3.3-3.2 1.2M8.4 10.7c.1 1.2-.3 2.3-1.2 3.2" />
  </>
));

export const IcMegaphone = make("IcMegaphone", (
  <>
    <path d="M13.4 2.7v8.7L4.7 9.2H3a1.7 1.7 0 0 1-1.7-1.7v-.9A1.7 1.7 0 0 1 3 4.9h1.7l8.7-2.2Z" />
    <path d="m5.2 9.4.8 3.5h2.1" />
  </>
));

export const IcMonitor = make("IcMonitor", (
  <>
    <rect x="1.9" y="2.9" width="12.2" height="8.2" rx="1.2" />
    <path d="M8 11.1v2.5M5.4 13.6h5.2" />
  </>
));

export const IcChart = make("IcChart", (
  <>
    <path d="M2.4 2.4v11.2h11.2" />
    <path d="m4.9 9.7 2.6-2.9 2.1 1.8 3.4-4.1" />
  </>
));

export const IcCube = make("IcCube", (
  <>
    <path d="M8 1.9 13.4 5v6L8 14.1 2.6 11V5L8 1.9Z" />
    <path d="M2.6 5 8 8.1 13.4 5" />
    <path d="M8 8.1v6" />
  </>
));

export const IcSignOut = make("IcSignOut", (
  <>
    <path d="M6.3 2.4H3.5a1.1 1.1 0 0 0-1.1 1.1v9a1.1 1.1 0 0 0 1.1 1.1h2.8" />
    <path d="M10.4 4.9 13.5 8l-3.1 3.1" />
    <path d="M13.5 8H6" />
  </>
));

export const IcCheck = make("IcCheck", (
  <path d="m3.3 8.4 3 3 6.4-6.8" />
));
