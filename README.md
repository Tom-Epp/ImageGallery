# Project Documentation

## Description

This project is a web application built using Next.js 16 and TypeScript. It serves as a platform for users to browse a collection of images sourced from Unsplash. The application features a responsive design styled with Tailwind CSS and incorporates state management using TanStack Query (V4) for efficient data fetching and caching.

### Core Features:

- Responsive design for optimal viewing on desktop and mobile devices
- Infinite scroll photo feed
- Search photos by keyword with 500ms debounce
- Filter photos by Latest or Popular

### Performance Optimizations:

- Image optimization using Next.js's built-in Image component
- TanStack Query caching with different stale times for feed vs. search
- Memorized photo duplication with `useMemo`

## Tooling

### Development

- Language(s): [TypeScript](https://www.typescriptlang.org/)
- Framework: [Next.js 16](https://nextjs.org/)
- Package Manager: [npm](https://www.npmjs.com/)
- Version Control: [GitHub](https://github.com/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Linting: [ESLint](https://eslint.org/)
- Code Formatting: [Prettier](https://prettier.io/)
- Image data source: [Unsplash](https://unsplash.com/)
- State Management: [TanStack Query (V4)](https://tanstack.com/query/v4)

---

### Testing

- Unit Testing: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

### Deployment

Production deployment is done on Vercel, which provides easy integration with Next.js applications.

- Vercel
- Environment Management: `.env`

---

## Project Architecture

- The project was generated using the [Next.js cli command](https://nextjs.org/docs/app/api-reference/cli/create-next-app) with default settings (TypeScript, Tailwind CSS, ESLint, Import alias).
- This project follows the app router folder structure with separate directories for components, hooks, utils, and API routes. Non routable files are placed in directories prefixed with an underscore to avoid being treated as routes by Next.js (e.g., `_components`, `_hooks`).
- The application uses Next.js API routes to handle server-side logic and proxy requests to the [Unsplash API](https://unsplash.com/documentation)

## Running the project locally

- Create a free Unsplash API key by signing up at [Unsplash Developers](https://unsplash.com/developers).
- Clone the repository and navigate to the project directory.
- Create a `.env` file in the root directory an add the necessary environment variables (see `.env.example` for reference).
- Install dependencies using your preferred package manager. (e.g., `npm install`)
- Start the development server (e.g., `npm run dev`) and open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Running the tests

- Run unit tests using the command located in the `package.json` (e.g., `npm run test`)

## Issues

| Issue                                                                                                                        | Resolution                                                                                     |
|------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Data feching and caching                                                                                                     | Implemented TanStack `useInfiniteQuery` to handle paginated requests to Unsplash API           |
| Duplicate photo keys across pages                                                                                            | Dedupe by id when flattening pages                                                             |
| API key exposed on the client                                                                                                | Creating a Next.js API route to that proxies requests server-side.                             |
| Input lag search field - keystrokes updated state in the parent `PhotoFeed` re-rendering the entire tree including the input | Move state into search field                                                                   |
| `undefined` items in photo array after adding search functionality                                                           | Normalizing the API route result to always unwrap `data.results` when a query param is present |
| Sort filter causing layout shifts                                                                                            | Move sorting to the API via order_by param instead of reordering client-side                   |

---

## Future Improvements

### Developer Experience

- Husky pre-commit hooks for linting and type checking.

### Features & optimizations

- List virtualization using TanStack virtual (`@tanstack/react-virtual
`) for improved performance with large photo feeds and only render the visible photos.
- Add retry logic for failed API requests.
- Photo detail page with full-resolution image and metadata.
- Inform the user when the end of the feed is reached.
- Allow passing of options to the intersection observer (e.g., root margin, threshold, scroll margin).

## Additional Notes

### Known limitations

- Unsplash API has a rate limit of 50 requests per hour for development applications. When the limit is reached, the application will not be able to fetch new photos until the limit resets.
