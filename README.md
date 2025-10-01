# Chat-App Frontend

This Vite + React client powers the Chat-App experience, including real-time messaging, profile management, and the new social post feed.

## Getting started

```powershell
# install dependencies
npm install

# start the dev server (http://localhost:5173 by default)
npm run dev

# run lint checks
npm run lint
```

## Key features

- **Authentication** – Sign up, log in, and manage your profile photo.
- **Messaging dashboard** – Responsive chat list, conversation view, and typing area.
- **Post feed (`/posts`)**
  - Post composer with media uploads (images & video, up to four attachments).
  - Visibility controls (public, connections, private) and shortcut for quick share (`⌘/Ctrl` + `Enter`).
  - Infinite feed with filter and sort controls (all, mine, connections, reposts; recent, liked, trending).
  - Rich post cards with like, comment, repost, and view counters plus nested original content for reposts.
  - Slide-in comment panel for threaded discussions with inline likes and live counts.

## Adding posts & comments

1. Navigate to **Posts** via the navbar (requires authentication).
2. Compose text, optionally attach media, pick visibility, and click **Share**.
3. Use the filter/sort controls to adjust the feed scope.
4. Open comments from any post to reply or like individual comments.

## Technology stack

- [React 19](https://react.dev/) with [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [Vite](https://vitejs.dev/) for tooling and HMR
- [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/) for styling
- [lucide-react](https://lucide.dev/) icons
- [axios](https://axios-http.com/) for API requests

## Next steps

- Expand media handling in comments (uploads & galleries).
- Add integration tests for the post store and optimistic updates.
- Surface channel-specific feeds once channel visibility posts are available in the UI.
