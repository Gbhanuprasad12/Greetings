# Technical Approach Document

## Problem-Solving Approach: Image Overlay Logic
One of the core challenges was overlaying user profile data (name and profile picture) onto a background image and combining them into a single shareable image.
I used standard HTML and CSS for the live preview. By wrapping the background image and absolute-positioning the avatar and name on top of it, we achieve a high-fidelity "WYSISYG" live preview out of the box in the `Home` and `Share` layouts. 

Once the user wants to download or share the image, this visual representation needs to be converted into an actual file format (like PNG). To do this, I implemented the `html-to-image` library (`toPng`).
This library parses the referenced DOM node using a `useRef`, calculates the computed styles, draws it onto a canvas object internally, and ultimately outputs a Data URL representation of a PNG image. This means what the user sees in HTML is exactly what they get in their screenshot, reliably handling the layer merging logically locally within the client's browser.

## Tech Stack
- **React.js (Vite)**: Selected for its swift start-times, built-in bundling properties (esbuild), and hot module replacement. Perfect for a responsive frontend client.
- **Vanilla CSS**: Used explicitly (per constraints, avoiding Tailwind or Component Libraries) to harness modern grid layouts, CSS Variables for theming, and backdrop-filter for glassmorphism.
- **react-router-dom**: Used for single-page routing between the Login, Home (grid), and the Editor/Share flow.
- **html-to-image**: Resolves the exact technical problem of converting a DOM sub-tree containing multiple overlay layers into a single renderable `blob` buffer for downloading.
- **lucide-react**: Lightweight icon library for rendering common SVG primitives (Share, Download icons).

## Challenges Faced & Solutions
1. **Handling Cross-Origin Images in HTML-to-Canvas**: `html-to-image` functions by drawing pixels to a dirty canvas. If the external URLs (Unsplash avatars or placeholders) lack CORS headers, the canvas becomes "tainted", and `toPng` fails with a security error. 
   - *Solution*: Setting `crossOrigin="anonymous"` attributes directly on the `<img />` tags circumvents this by enforcing strict CORS preflights on the requests, allowing the browser to read the image blob into the canvas cleanly.
2. **Device Pixel Ratio**: The exported images sometimes looked blurry on Retina screens.
   - *Solution*: Passed `{ pixelRatio: 2 }` in `html-to-image` options to scale up the canvas before rendering, significantly improving output sharpness.
3. **Native Sharing Constraints**: The native `navigator.share()` API does not reliably support Data URLs directly, it strictly expects standard File objects in many OS versions.
   - *Solution*: A fetch sequence was set up to convert the `dataUrL` -> `blob` -> `File` object before passing it to `navigator.share()`, incorporating a fallback to regular download if Web Share API was unavailable.

## Future Improvements
- **Scalability**: Implementing a backend (Node.js/Express with MongoDB) to handle proper server-side authentication (JWTs) and user data persistence. The templates could similarly be stored in an S3 bucket with a CDN to minimize bundle loading times.
- **Server-side Rendering**: To circumvent client-side performance hurdles of parsing DOM into Canvas on slow devices, layer coordination could be sent up to an API using an image manipulation library like `Sharp` (Node) or `Pillow` (Python), returning the flattened image URL on-the-fly.
- **Custom Font Handling**: Loading custom web fonts tightly into `html-to-image` can be asynchronous; preemptive loading mechanisms and strict CSS parsing logic are recommended if the application implements extensive typography tools.
