# Fix: First-Load White Screen & Splash Optimization

The current "White Screen" issue is caused by the `App` component unmounting the entire application state during the Splash screen, and the `LandingPage` returning `null` while waiting for redirects on mobile.

## User Review Required

> [!IMPORTANT]
> **Performance Win**
> By refactoring the app lifecycle, the website will now verify your login **while** the splash screen is showing. This means as soon as the splash finishes, you'll be exactly where you need to be without a second "loading" spinner.

## Proposed Changes

### [Frontend] - App Lifecycle Refactor
#### [MODIFY] [App.jsx](file:///c:/Users/dasar/OneDrive/Desktop/AntiGravityHMS/frontend/src/App.jsx)
- **Persistent Mounting**: Move `AuthProvider` and `Router` to the top level so they never unmount.
- **Splash Overlay**: Convert `MobileSplash` into a conditional overlay that sits on top of the app content.
- **State Sync**: Use a simpler state to handle the splash exit.

#### [MODIFY] [LandingPage.jsx](file:///c:/Users/dasar/OneDrive/Desktop/AntiGravityHMS/frontend/src/pages/LandingPage.jsx)
- **Remove White Screen Trap**: Replace `return null;` with the global `LoadingScreen`. This ensures that even for a split second, the user sees a branded loader instead of a blank white page.
- **Improved Redirect**: Optimize the mobile redirect to happen instantly once auth is verified.

### [Frontend] - UI Polish
#### [MODIFY] [MobileSplash.jsx](file:///c:/Users/dasar/OneDrive/Desktop/AntiGravityHMS/frontend/src/components/MobileSplash.jsx)
- Add a "Fade Out" animation so the transition from the splash to the app is silky smooth.

## Verification Plan

### Manual Verification
- **Clear Site Data**: I will ask you to clear your browser cache/site data and reload.
- **First Load Test**: Verify that the splash shows, then immediately reveals the Login or Registration page without any white flashing.
- **Re-open Test**: Verify that opening a new tab skips the splash (as it does now) and works instantly.
