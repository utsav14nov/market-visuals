# Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Environment Variables
1. **Set Production API URL**: Create a `.env.production` file with:
   ```
   VITE_API_BASE_URL=https://your-production-api-url.com
   ```
   Or set it in your deployment platform's environment variables.

2. **Verify .env files are ignored**: Ensure `.env`, `.env.local`, `.env.production` are in `.gitignore`

### ✅ Build the Application
```bash
npm run build:prod
```

This creates an optimized production build in the `dist/` directory.

### ✅ Test Production Build Locally
```bash
npm run preview:prod
```

### ✅ Deployment Considerations

#### For Static Hosting (Vercel, Netlify, GitHub Pages, etc.)
1. Set environment variable `VITE_API_BASE_URL` in your hosting platform
2. Deploy the `dist/` folder
3. Ensure your backend API has CORS configured to allow requests from your frontend domain

#### For Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### CORS Configuration
Ensure your backend API allows requests from your production domain:
- Add your frontend domain to CORS allowed origins
- Example: `Access-Control-Allow-Origin: https://your-frontend-domain.com`

### ✅ Security Checklist
- [x] `.env` files are in `.gitignore`
- [x] No hardcoded API keys in code
- [x] API URL configured via environment variables
- [x] Error boundaries implemented
- [x] Console logs removed or dev-only

### ✅ Performance Optimizations
- [x] Production build minification enabled
- [x] Code splitting configured
- [x] Source maps disabled in production

### ✅ Testing
1. Test API connectivity from production domain
2. Verify images load correctly
3. Test infinite scroll functionality
4. Test error handling (disconnect network, invalid API response)
5. Test on mobile devices

## Common Issues

### API Connection Errors
- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS configuration on backend
- Verify backend is accessible from production domain

### Build Errors
- Ensure all dependencies are installed: `npm ci`
- Check for TypeScript errors: `npm run build`
- Verify Node.js version matches requirements

### Environment Variables Not Working
- Remember: Vite requires `VITE_` prefix for client-side variables
- Rebuild after changing environment variables
- Check that variables are set in deployment platform
