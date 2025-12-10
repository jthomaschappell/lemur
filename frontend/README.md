# Lemur Store

A modern React + Vite application for browsing and ordering premium lemurs.

## Features

- **Home Page**: Browse a grid of 12 different lemur breeds with images and descriptions
- **About Page**: Learn about the Lemur Store mission and story
- **Place Order**: Select lemurs and quantities in a form-like interface, then checkout

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Manual QA Tests

### Home Page
1. ✅ Verify 12 lemur cards are displayed in a grid
2. ✅ Check that each card shows an image, name, and description
3. ✅ Verify cards have hover effects
4. ✅ Test responsive layout on mobile/tablet

### Navigation
1. ✅ Click "Home" - should navigate to home page
2. ✅ Click "About" - should navigate to about page
3. ✅ Click "Place Order" - should navigate to order page
4. ✅ Verify navbar is sticky and visible on scroll

### About Page
1. ✅ Verify page displays mission, features, and story sections
2. ✅ Check gradient background matches design
3. ✅ Verify text is readable and well-formatted

### Place Order Page
1. ✅ Verify all 12 lemurs are listed in the form
2. ✅ Test quantity buttons (+ and -) for each lemur
3. ✅ Verify total items and total price update correctly
4. ✅ Test "Check Out" button (should be disabled when no items selected)
5. ✅ After checkout, verify order confirmation page shows:
   - Total items count
   - Total price
   - List of ordered items with quantities
6. ✅ Test "Place Another Order" button returns to form

## Tech Stack

- React 18
- Vite
- React Router DOM
- CSS3 (with green/yellow gradients)

