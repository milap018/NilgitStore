# Nilgit Store

A beginner-friendly full-stack e-commerce project built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, JWT cookies, Stripe test payments, and Cloudinary image uploads.

## What You Are Building

This project has two apps:

- `client`: React frontend for customers and admins.
- `server`: Express API for auth, products, orders, payments, and uploads.

The code is intentionally simple so you can learn the flow before adding advanced patterns.

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
copy client\.env.example client\.env
copy server\.env.example server\.env
```

3. Fill `server/.env`:

- `MONGO_URI`: your MongoDB connection string.
- `JWT_SECRET`: any long random string for local development.
- `STRIPE_SECRET_KEY`: Stripe test secret key, starting with `sk_test_`.
- `CLIENT_URL`: usually `http://localhost:5173`.
- Cloudinary values from your Cloudinary dashboard.

4. Fill `client/.env`:

- `VITE_API_URL=http://localhost:5000/api`
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe test publishable key, starting with `pk_test_`.

## Run

Start both apps:

```bash
npm run dev
```

Or run separately:

```bash
npm run dev:server
npm run dev:client
```

Frontend:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5000/api/health
```

## Local MongoDB With Docker

This project includes a Docker Compose file for MongoDB. Start MongoDB before running the backend:

```bash
docker compose up -d mongo
```

The default local server environment uses:

```text
mongodb://127.0.0.1:27017/nilgit-store
```

## Run The Built Frontend Without Vite

If Vite cannot start in a restricted environment, build the frontend and serve the generated `dist` folder:

```bash
npm run build --prefix client
npm run serve:dist --prefix client
```

The built frontend runs at:

```text
http://localhost:5173
```

## Seed Sample Products

After setting `server/.env`, run:

```bash
npm run seed
```

The seed creates:

- Admin user: `admin@example.com`
- Password: `password123`
- Sample products with remote image URLs

## Main Learning Flows

### 1. Frontend Folder Structure

- `assets`: static images or local files.
- `components/common`: reusable small components like loaders and error messages.
- `components/layout`: navbar, footer, page wrapper.
- `components/product`: product cards and product-specific UI.
- `components/ui`: buttons, inputs, reusable UI building blocks.
- `pages/auth`: signup and signin pages.
- `pages/shop`: customer pages such as products, cart, checkout, orders.
- `pages/admin`: admin-only product management.
- `context`: Auth and Cart Context API state.
- `hooks`: small reusable hooks.
- `services`: Axios API functions.
- `routes`: protected route components.
- `utils`: helper functions.

### 2. Backend Folder Structure

- `config`: database, Cloudinary, Stripe setup.
- `controllers`: request logic for auth, products, orders, uploads, and payments.
- `middleware`: auth, admin, upload, and error helpers.
- `models`: Mongoose schemas.
- `routes`: Express route files.
- `utils`: small server helpers.
- `seed`: sample database data.

### 3. Signup Flow

The user enters name, email, and password. React sends the form to `POST /api/auth/signup`. The backend validates required fields, checks if the email already exists, hashes the password with bcrypt, saves the user, creates a JWT, and stores it in an httpOnly cookie.

Test it by signing up from `/signup`, then opening DevTools > Application > Cookies.

### 4. Signin Flow

The user enters email and password. React sends the form to `POST /api/auth/signin`. The backend finds the user, compares the password with bcrypt, creates a JWT, and sets the cookie.

Test it by signing in and refreshing the page. You should stay logged in.

### 5. Cookie And Session Flow

The JWT is stored in an httpOnly cookie named `token`. The frontend cannot read this cookie directly, which is safer. On page load, `AuthContext` calls `GET /api/auth/session`. If the cookie is valid, the backend returns the user.

### 6. JWT Flow

JWT means JSON Web Token. The server signs a small payload with the user id. On protected routes, the backend reads the token from cookies and verifies it with `JWT_SECRET`.

### 7. Protected Route Flow

Frontend protected routes check `user` from `AuthContext`. Backend protected routes use `protect` middleware. Admin routes also use `adminOnly`.

### 8. Product Flow

Products are stored in MongoDB. The frontend loads products with Axios from `GET /api/products`. Product detail pages use `GET /api/products/:id`.

Products now follow a Flipkart-style shape:

- Name, brand, category, subcategory, and description.
- Original price, discount percentage, and calculated selling price.
- Stock quantity and derived status.
- Multiple product images.
- Rating, review count, highlights, specifications, delivery info, return policy, and seller name.

### 8A. Category And Subcategory Flow

Categories are stored in `client/src/utils/categoryData.js`. Each category has a list of subcategories. The admin form first asks for a category, then fills the subcategory dropdown from the selected category.

Example:

```text
Mobiles -> Smartphones, Feature Phones, Mobile Accessories
Electronics -> Laptops, Cameras, Headphones, Smart Watches
```

The products page also uses the same category data for filtering.

### 8B. Discount Price Flow

The admin enters `originalPrice` and `discountPercentage`. The frontend calculates `sellingPrice` immediately, and the backend recalculates it again before saving so the database cannot be tricked by a wrong frontend value.

Formula:

```text
sellingPrice = originalPrice - (originalPrice * discountPercentage / 100)
```

Example:

```text
10000 - (10000 * 20 / 100) = 8000
```

### 8C. Stock Flow

Stock is stored as `stockQuantity`.

- `0` shows `Out of Stock`.
- Less than `5` shows `Only few left`.
- `5` or more shows `In Stock`.

The frontend disables Add to Cart and Buy Now for out-of-stock products. The backend also checks stock during checkout, so users cannot bypass the UI and submit out-of-stock products through the API.

### 9. Cart Flow

Cart state is stored in `CartContext` and persisted to `localStorage`. Add, remove, and quantity update actions happen on the frontend.

### 10. Checkout Flow

Checkout sends cart items to the backend. The backend creates an order and a Stripe Checkout test session.

### 11. Payment Flow

The backend creates a Stripe Checkout session using the secret test key. The browser redirects to Stripe. After success, the app calls the verify endpoint and marks the order paid if Stripe confirms payment.

### 12. Order Flow

Orders store user id, products, totals, payment status, and shipping address. Users can see their own order history at `/orders`.

After Stripe confirms a successful test payment, the backend reduces each product's `stockQuantity` by the purchased quantity. If payment verification runs again for the same order, stock is not reduced twice.

### 13. Cloudinary Image Upload Flow

Admins select an image on product forms. The frontend sends `FormData` to `POST /api/uploads`. The backend receives the file with Multer, uploads it to Cloudinary, and returns the secure URL. That URL is saved in MongoDB as the product image.

The product form supports multiple images. The backend returns `imageUrls`, and the product stores those URLs in the `images` array. Product cards use the first image, while product details show a gallery.

### 14. Admin Flow

Admin users can add, edit, and delete products. The backend protects those routes with both `protect` and `adminOnly`.

## Payment Safety

Use only Stripe test keys. Never put secret keys in the frontend. The secret key belongs only in `server/.env`.

## Beginner Debugging

See [Errors.md](./Errors.md) for common frontend, backend, MongoDB, payment, and Cloudinary errors with causes and fixes.
