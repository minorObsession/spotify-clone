// // Cookie helper functions for secure token storage

// /**
//  * Sets a cookie with the given name, value and options
//  */
// export function setCookie(
//   name: string,
//   value: string,
//   options: {
//     days?: number;
//     path?: string;
//     domain?: string;
//     secure?: boolean;
//     sameSite?: "strict" | "lax" | "none";
//   } = {},
// ) {
//   const {
//     days = 7,
//     path = "/",
//     domain = "",
//     secure = true,
//     sameSite = "strict",
//   } = options;

//   // Calculate expiry
//   const expires = days ? new Date(Date.now() + days * 864e5) : undefined;

//   // Build cookie string
//   let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

//   if (expires) cookieStr += `; expires=${expires.toUTCString()}`;
//   if (path) cookieStr += `; path=${path}`;
//   if (domain) cookieStr += `; domain=${domain}`;
//   if (secure) cookieStr += "; secure";
//   cookieStr += `; samesite=${sameSite}`;

//   // Set the cookie
//   document.cookie = cookieStr;
// }

// /**
//  * Gets a cookie value by name
//  */
// export function getCookie(name: string): string | null {
//   const nameEQ = `${encodeURIComponent(name)}=`;
//   const cookies = document.cookie.split(";");

//   for (let cookie of cookies) {
//     let c = cookie;
//     while (c.charAt(0) === " ") c = c.substring(1);
//     if (c.indexOf(nameEQ) === 0) {
//       return decodeURIComponent(c.substring(nameEQ.length));
//     }
//   }

//   return null;
// }

// /**
//  * Deletes a cookie by setting its expiration date in the past
//  */
// export function deleteCookie(
//   name: string,
//   options: { path?: string; domain?: string } = {},
// ) {
//   const { path = "/", domain = "" } = options;

//   // Delete by setting expiry in the past
//   document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ""}`;
// }
