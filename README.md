# Explore Terrastories

![CI](https://github.com/terrastories/explore-terrastories/workflows/CI/badge.svg)
![Deploy](https://github.com/terrastories/explore-terrastories/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)

A web application for public exploration of community stories shared through [Terrastories](https://github.com/terrastories/terrastories).

## Overview

Explore Terrastories allows communities to share their place-based stories publicly. It connects to a Terrastories server API to display unrestricted stories that communities have opted to share.

**Built with:**
- React + TypeScript
- [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js) with [Protomaps](https://github.com/protomaps) for mapping
- Vite for build tooling
- Axios for API requests

📚 **Documentation**: [docs.terrastories.app](https://docs.terrastories.app/)

## Prerequisites

- Node.js 20+
- A running [Terrastories](https://github.com/terrastories/terrastories) server with API access

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Connection

Create a `.env` file with your Terrastories API endpoint:

```env
VITE_API_BASE=https://your-terrastories-server.com
```

### 3. Configure CORS

Add your Explore Terrastories host to the `CORS_ORIGINS` variable in your Terrastories server's `.env.api` file:

```env
CORS_ORIGINS=http://localhost:1080,https://your-explore-domain.com
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:1080](http://localhost:1080) to view the app.

## Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Type checking
npm run lint
```

## Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be output to the `dist/` folder.

### Preview Production Build

```bash
npm run serve
```

### GitHub Pages

Deployment to GitHub Pages happens automatically on push to `main` via GitHub Actions.

## Project Structure

```
src/
├── components/     # React components
├── utils/          # Utility functions
├── translations/   # i18n translations
└── setupTests.ts   # Test configuration
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to the `main` branch.

## License

See [LICENSE](LICENSE) file for details.

## Related Projects

- [Terrastories](https://github.com/terrastories/terrastories) - Main application
- [Terrastories Documentation](https://docs.terrastories.app/) - User guides and support

---

**Developed by [Awana Digital](https://awana.digital)**
