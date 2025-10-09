# SKFood Frontend

A production-grade React frontend for SKFood - a meal delivery application built with modern web technologies.

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with design tokens
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: Zustand + TanStack Query
- **HTTP Client**: Axios
- **Component Library**: Custom components with Storybook
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier + Husky

## 🏗️ Project Structure

```
src/
├── components/          # Atomic UI components
│   ├── ui/             # Base components (Button, Input, Card, etc.)
│   └── layout/         # Layout components (Header, Layout)
├── features/           # Feature-specific components
│   ├── auth/           # Authentication components
│   ├── meal-builder/   # Meal builder stepper components
│   ├── cart/           # Cart components
│   ├── orders/         # Order management components
│   └── admin/          # Admin panel components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── routes/             # Route configuration
├── services/           # API services and queries
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and Tailwind config
```

## 🛠️ Setup & Installation

1. **Clone and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_APP_NAME=SKFood
   VITE_DELIVERY_RADIUS_KM=2
   VITE_SHOP_LAT=28.6139
   VITE_SHOP_LNG=77.2090
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run storybook` - Start Storybook (http://localhost:6006)
- `npm run build-storybook` - Build Storybook
- `npm run lint` - Run ESLint

## 🎨 Design System

### Colors
- **Primary**: #FF7043 (Orange) - Main brand color
- **Neutral**: Gray scale from 50-900
- **Semantic**: Success (Green), Error (Red), Warning (Yellow), Info (Blue)

### Typography
- **Primary Font**: Inter (body text)
- **Display Font**: Plus Jakarta Sans (headings)
- **Weights**: 300, 400, 500, 600, 700

### Spacing System
- Based on 8px grid system
- Custom spacing: xs(4px), sm(8px), md(16px), lg(24px), xl(32px), 2xl(48px)

### Components
All components follow atomic design principles:
- **Atoms**: Button, Input, Card, Modal, Toast
- **Molecules**: Form groups, navigation items
- **Organisms**: Header, meal builder steps, cart
- **Templates**: Page layouts
- **Pages**: Complete page implementations

## 🔧 Key Features

### Authentication
- JWT-based authentication with automatic token refresh
- Persistent login state with Zustand
- Protected routes with automatic redirects

### Meal Builder
- 3-step vertical stepper with smooth animations
- Real-time price calculation
- Validation for sabji selection (max 2)
- Extra roti customization

### Cart Management
- Persistent cart state across sessions
- Real-time price updates
- Quantity management with limits

### Responsive Design
- Mobile-first approach
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
- Touch-friendly interactions

### Performance
- Lazy loading for pages
- Image optimization
- Bundle splitting
- React Query caching

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

Key test files:
- `src/components/__tests__/` - Component tests
- `src/hooks/__tests__/` - Hook tests
- `src/utils/__tests__/` - Utility function tests

### Storybook
```bash
npm run storybook
```

All atomic components have corresponding stories for:
- Default states
- Variants and sizes
- Interactive states
- Error states

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=SKFood
VITE_DELIVERY_RADIUS_KM=2
VITE_SHOP_LAT=your_shop_latitude
VITE_SHOP_LNG=your_shop_longitude
```

### Deployment Checklist
- [ ] Update API URL in production env
- [ ] Configure CORS on backend
- [ ] Set up proper error tracking
- [ ] Configure analytics
- [ ] Test all user flows
- [ ] Verify responsive design
- [ ] Check accessibility compliance

## 🔍 API Integration

The frontend connects to the provided backend API endpoints:

### User Authentication
- `POST /api/userAuth/signup` - User registration
- `POST /api/userAuth/login` - User login
- `GET /api/userAuth/profile` - Get user profile
- `POST /api/userAuth/logout` - User logout

### Menu Management
- `GET /api/userPanel/seeLunchMenu` - Get lunch menu
- `GET /api/userPanel/seeDinnerMenu` - Get dinner menu

### Order Management
- `POST /api/userPanel/orderPreparedThali` - Create order
- `GET /api/userPanel/myAllOrders` - Get user orders
- `GET /api/userPanel/confirmedOrders` - Get confirmed orders

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/allOrders` - Get all orders
- `PUT /api/admin/createMeal` - Create/update menu

## 🎯 Performance Optimizations

- **Code Splitting**: Lazy loading for pages
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: React Query for server state
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists (orders, menu items)

## 🔒 Security

- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based authentication
- **Secure Storage**: Sensitive data in httpOnly cookies
- **Input Validation**: Client and server-side validation
- **Error Handling**: No sensitive data in error messages

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Follow the established code style (Prettier + ESLint)
2. Write tests for new components
3. Update Storybook stories
4. Follow atomic design principles
5. Ensure responsive design
6. Test accessibility compliance

## 📄 License

This project is proprietary software. All rights reserved.