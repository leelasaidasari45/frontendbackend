# Implementation Plan: Dark & Light Mode Support

Add a comprehensive theme management system to the web application, allowing users to toggle between Light and Dark modes. The preference will be saved in the browser's local storage.

## User Review Required

> [!NOTE]
> **Theme Scope**
> The dark mode will primary affect the Dashboard regions (for both Owners and Tenants). Authentication pages and the Landing page already have specific dark/glass styles that will be preserved.

## Proposed Changes

### [Frontend] - Theme Engine
#### [MODIFY] [index.css](file:///c:/Users/dasar/OneDrive/Desktop/AntiGravityHMS/frontend/src/index.css)
- Define a `.dark-mode` class that overrides the CSS variables in `:root`.
- Update standard colors to be more reactive to variable changes.

#### [NEW] [ThemeContext.jsx](file:///c:/Users/dasar/OneDrive/Desktop/AntiGravityHMS/frontend/src/context/ThemeContext.jsx)
- Create a `ThemeContext` and `ThemeProvider`.
- Synchronize the `theme` state ('light' or 'dark') with `localStorage`.
- Toggle the CSS class on the `document.body`.

#### [NEW] [ThemeToggle.jsx](file:///c:/Users/dasar/OneDrive/Desktop/AntiGravityHMS/frontend/src/components/ThemeToggle.jsx)
- A reusable button with smooth sun/moon icon transitions.

### [Frontend] - Integration
#### [MODIFY] [App.jsx](file:///c:/Users/dasar/OneDrive/Desktop/AntiGravityHMS/frontend/src/App.jsx)
- Keep `MobileSplash` timeout at 2.8s.
- Update the `LoadingScreen` fallback to match the "Galaxy Glass" aesthetic instead of a plain white background.

### 🎨 Visual Feedback

#### [MODIFY] [MobileSplash.jsx](file:///c:/Users/dasar/OneDrive/Desktop/AntiGravityHMS/frontend/src/components/MobileSplash.jsx)
- Add a **Dynamic Status Indicator**. This will cycle through messages like "Waking up server...", "Establishing secure link...", "Preparing dashboard..." every 800ms.
- Ensure the splash screen feels alive with a subtle breathe or pulse animation.

#### [MODIFY] [TenantDashboard.jsx](file:///c:/Users/dasar/OneDrive/Desktop/AntiGravityHMS/frontend/src/pages/tenant/TenantDashboard.jsx)
- Inject the `ThemeToggle` into the tenant dashboard header.

## Verification Plan

### Manual> [!IMPORTANT]
> - **Keep Splash Timing**: As requested, we will NOT change the 2.8s mobile splash duration. It will remain exactly as it is.
> - **Immediate Brand Presence**: I will replace the generic white loading screen in `index.html` with a premium, high-contrast splash screen that appears within milliseconds.
> - **Backend Pre-warming**: I will initiate a non-blocking "handshake" with the backend in `main.jsx` to wake up the server while the React application is still downloading. This drastically reduces the secondary wait.
> - **Progress Indicators**: I will add "Connecting to server...", "Authenticating...", etc., to the splash screen so the user knows exactly what is happening.
