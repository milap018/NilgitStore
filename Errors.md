# Errors.md

This file teaches common errors you will see while building this project. Read the error slowly, find the file mentioned in the stack trace, and fix the first real error before chasing later messages.

## How To Read Browser Console Errors

### Error
`Cannot read properties of undefined`

### Why It Happened
Your component tried to use data before the API finished loading.

### Fix
Use a loading state or optional chaining:

```jsx
{product?.name}
```

### Prevention
Always check API data before rendering nested properties.

## How To Use The Network Tab

Open DevTools > Network, click the failed request, then check:

- URL: is the endpoint correct?
- Method: is it GET, POST, PUT, or DELETE as expected?
- Status: is it 200, 401, 404, or 500?
- Request payload: did the form send the right data?
- Response: what error did the backend return?

## How To Inspect Cookies

Open DevTools > Application > Cookies > `http://localhost:5173` or `http://localhost:5000`.

Look for:

- `token` cookie exists after signin.
- Cookie is httpOnly.
- Cookie is removed after logout.

## How To Debug Backend Terminal Errors

The backend terminal usually shows the file and line number. Start with the first error line. Later errors often happen because the first one broke the server.

## How To Use console.log Properly

Use logs to answer one question at a time:

```js
console.log("signup body:", req.body);
console.log("current user:", user);
```

Remove noisy logs after the bug is fixed.

## How To Test APIs With Postman Or Thunder Client

1. Start the backend with `npm run dev:server`.
2. Send requests to `http://localhost:5000/api`.
3. For protected routes, signin first so the cookie is stored.
4. In Postman, enable cookie handling.

## Frontend Errors

## Error
`Attempted import error: 'ProductCard' is not exported`

## Why It Happened
The file uses a default export but you imported it as a named export, or the reverse.

## What It Looks Like
`The requested module does not provide an export named 'ProductCard'`

## Fix
For default export:

```jsx
import ProductCard from "../components/product/ProductCard.jsx";
```

For named export:

```jsx
import { ProductCard } from "../components/product/ProductCard.jsx";
```

## Prevention
Use one style consistently. This project mostly uses default exports for components.

## Error
JSX syntax mistake

## Why It Happened
A tag was not closed, or JSX returned two parent elements.

## What It Looks Like
`Adjacent JSX elements must be wrapped in an enclosing tag`

## Fix
Wrap content in a single parent:

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```

## Prevention
Format files often and keep JSX small.

## Error
Component not rendering

## Why It Happened
The route is wrong, the component was not imported, or a condition returns nothing.

## What It Looks Like
Blank page with no obvious error.

## Fix
Check the browser console, then check `App.jsx` routes and component imports.

## Prevention
Add one route at a time and test it.

## Error
Props undefined

## Why It Happened
Parent did not pass the prop, or child uses the wrong prop name.

## What It Looks Like
`Cannot read properties of undefined`

## Fix
Check the parent:

```jsx
<ProductCard product={product} />
```

Check the child:

```jsx
function ProductCard({ product }) {}
```

## Prevention
Use clear prop names and inspect React DevTools.

## Error
useState mistakes

## Why It Happened
You mutated state directly instead of using the setter.

## What It Looks Like
UI does not update.

## Fix
Use the setter:

```jsx
setItems((oldItems) => [...oldItems, newItem]);
```

## Prevention
Never push directly into state arrays.

## Error
useEffect dependency mistake

## Why It Happened
The dependency array is missing or includes a value that changes every render.

## What It Looks Like
Repeated API calls or stale data.

## Fix
Use dependencies carefully:

```jsx
useEffect(() => {
  loadProducts();
}, []);
```

## Prevention
Keep API load functions simple or memoize when needed.

## Error
Infinite re-render

## Why It Happened
You called a state setter directly during render.

## What It Looks Like
`Too many re-renders. React limits the number of renders`

## Fix
Move state changes into event handlers or `useEffect`.

## Prevention
Do not call `setState` in the main body of a component.

## Error
React Router route not found

## Why It Happened
The URL does not match any route in `App.jsx`.

## What It Looks Like
The app shows the fallback page.

## Fix
Check path spelling and dynamic route params.

## Prevention
Keep route paths in one file.

## Error
Form state bugs

## Why It Happened
Input `name` does not match the state key.

## What It Looks Like
Typing does not update the expected field.

## Fix
Make names match:

```jsx
<input name="email" value={form.email} onChange={handleChange} />
```

## Prevention
Use the same names as backend fields.

## Error
API not fetching

## Why It Happened
Backend is not running, URL is wrong, or CORS blocked the request.

## What It Looks Like
`Network Error` in Axios.

## Fix
Check backend terminal, `VITE_API_URL`, and Network tab.

## Prevention
Test `http://localhost:5000/api/health` before frontend calls.

## Error
CORS error

## Why It Happened
Backend did not allow frontend origin or credentials.

## What It Looks Like
`Access to XMLHttpRequest has been blocked by CORS policy`

## Fix
Set backend CORS:

```js
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
```

## Prevention
Keep client URL and backend CORS origin synced.

## Error
Image not showing

## Why It Happened
The image URL is empty, broken, or blocked.

## What It Looks Like
Broken image icon.

## Fix
Open the image URL directly in the browser and check MongoDB product data.

## Prevention
Save complete Cloudinary secure URLs.

## Error
Tailwind not working

## Why It Happened
Tailwind config paths are wrong or CSS import is missing.

## What It Looks Like
HTML appears unstyled.

## Fix
Check `tailwind.config.js` content paths and `src/index.css`.

## Prevention
Restart Vite after Tailwind config changes.

## Error
Environment variable issue

## Why It Happened
Vite frontend variables must start with `VITE_`.

## What It Looks Like
`undefined` API URL.

## Fix
Use `VITE_API_URL` and restart Vite.

## Prevention
Copy `.env.example` exactly.

## Error
Build error

## Why It Happened
Usually import paths, JSX syntax, or missing package.

## What It Looks Like
`npm run build` exits with an error.

## Fix
Read the first error, open that file, and fix the line shown.

## Prevention
Run the app often while building.

## Backend Errors

## Error
Server not starting

## Why It Happened
Missing dependency, wrong script, or syntax error.

## What It Looks Like
`SyntaxError` or `Cannot find module`

## Fix
Run `npm install --prefix server`, then check the first terminal error.

## Prevention
Install dependencies after changing `package.json`.

## Error
Nodemon error

## Why It Happened
The server crashed and nodemon is waiting for changes.

## What It Looks Like
`app crashed - waiting for file changes`

## Fix
Fix the shown error and save the file.

## Prevention
Keep terminal visible while coding.

## Error
Route not found

## Why It Happened
Wrong URL, wrong method, or route file not mounted.

## What It Looks Like
`Cannot POST /api/auth/login`

## Fix
Check `server.js` route mounting and route file paths.

## Prevention
Write API URLs in README or services files.

## Error
Middleware not running

## Why It Happened
Middleware was not added to the route.

## What It Looks Like
Protected data is visible or `req.user` is undefined.

## Fix
Use:

```js
router.get("/orders", protect, getOrders);
```

## Prevention
Review route chains carefully.

## Error
req.body undefined

## Why It Happened
Express JSON middleware is missing.

## What It Looks Like
`Cannot read properties of undefined`

## Fix
Add:

```js
app.use(express.json());
```

## Prevention
Add body middleware before routes.

## Error
JWT invalid or expired

## Why It Happened
Token is missing, old, or signed with another secret.

## What It Looks Like
`JsonWebTokenError: invalid signature`

## Fix
Logout, clear cookies, signin again, and check `JWT_SECRET`.

## Prevention
Do not change `JWT_SECRET` while testing active sessions.

## Error
Cookie not storing

## Why It Happened
Axios did not send credentials or backend CORS does not allow credentials.

## What It Looks Like
Signin works but refresh logs you out.

## Fix
Set Axios `withCredentials: true` and backend `credentials: true`.

## Prevention
Always test refresh after signin.

## Error
Auth failing

## Why It Happened
Cookie missing, token invalid, or route lacks middleware.

## What It Looks Like
`Not authorized`

## Fix
Check cookies, Network tab, and backend `protect` middleware.

## Prevention
Keep auth checks consistent.

## Error
bcrypt errors

## Why It Happened
Password is undefined or compare arguments are wrong.

## What It Looks Like
`data and hash arguments required`

## Fix
Validate password before calling bcrypt.

## Prevention
Check required fields in controllers.

## Error
async/await errors

## Why It Happened
Forgot `await` before database call.

## What It Looks Like
Promise objects appear instead of data.

## Fix
Use `await Product.find()`.

## Prevention
Any Mongoose call usually needs `await`.

## Error
Status code mistakes

## Why It Happened
Wrong status used for success or failure.

## What It Looks Like
Frontend treats response incorrectly.

## Fix
Use common codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error.

## Prevention
Keep status codes simple.

## MongoDB Errors

## Error
Connection failed

## Why It Happened
Wrong `MONGO_URI`, IP not allowed, or MongoDB service is down.

## What It Looks Like
`MongooseServerSelectionError`

## Fix
Check URI, password, database user, and Atlas network access.

## Prevention
Test MongoDB connection before building UI.

## Error
Schema validation error

## Why It Happened
Required field is missing or has wrong type.

## What It Looks Like
`Product validation failed`

## Fix
Check request body and schema required fields.

## Prevention
Validate forms before submitting.

## Error
Duplicate email error

## Why It Happened
Email already exists.

## What It Looks Like
`E11000 duplicate key error`

## Fix
Use another email or handle duplicate user message.

## Prevention
Check existing user before creating a new one.

## Error
Invalid ObjectId

## Why It Happened
MongoDB expected an id but got invalid text.

## What It Looks Like
`Cast to ObjectId failed`

## Fix
Check route params and validate ids before querying.

## Prevention
Use real ids from MongoDB.

## Error
Missing fields

## Why It Happened
Frontend did not send all required values.

## What It Looks Like
`Please fill all required fields`

## Fix
Check form state and backend validation.

## Prevention
Keep frontend field names matching backend schema.

## Error
Data not saving

## Why It Happened
Forgot `await product.save()` or validation failed.

## What It Looks Like
No new document in MongoDB.

## Fix
Check terminal errors and confirm save call runs.

## Prevention
Return saved data after creating records.

## Payment Errors

## Error
Test key issue

## Why It Happened
You used a live key, typo, or empty Stripe key.

## What It Looks Like
`Invalid API Key provided`

## Fix
Use Stripe test keys only: `sk_test_` on backend and `pk_test_` on frontend.

## Prevention
Never paste real payment keys into learning projects.

## Error
Payment session creation failed

## Why It Happened
Cart items are empty, price is invalid, or Stripe key is wrong.

## What It Looks Like
`StripeInvalidRequestError`

## Fix
Check order items, amount, and server `.env`.

## Prevention
Validate cart before checkout.

## Error
Payment verification failed

## Why It Happened
Session id is missing or Stripe says payment was not paid.

## What It Looks Like
`Payment is not completed`

## Fix
Check success URL contains `session_id={CHECKOUT_SESSION_ID}`.

## Prevention
Do not manually edit success URL query params.

## Error
Wrong success or cancel URL

## Why It Happened
`CLIENT_URL` is wrong.

## What It Looks Like
Stripe redirects to the wrong page.

## Fix
Set `CLIENT_URL=http://localhost:5173`.

## Prevention
Keep environment URLs updated.

## Cloudinary Errors

## Error
Upload failed

## Why It Happened
Cloudinary credentials are wrong or no file was sent.

## What It Looks Like
`Must supply api_key`

## Fix
Check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

## Prevention
Restart backend after editing `.env`.

## Error
Image URL not saving

## Why It Happened
The upload worked but product form did not store `image`.

## What It Looks Like
Product is created with empty image.

## Fix
Check upload response and product form state.

## Prevention
Disable submit until image URL exists if image is required.

## Error
Wrong environment variable

## Why It Happened
Variable name in code does not match `.env`.

## What It Looks Like
`undefined` values in backend logs.

## Fix
Compare `.env.example` with code in `config/cloudinary.js`.

## Prevention
Copy variable names exactly.

## Error
Image not displaying

## Why It Happened
MongoDB stored a broken URL.

## What It Looks Like
Broken image in product card.

## Fix
Open the URL directly. Re-upload if it fails.

## Prevention
Store Cloudinary `secure_url`, not local file paths.

## Product Form Errors

## Error
Selling price is wrong

## Why It Happened
Original price or discount percentage is empty, typed as text, or the formula was changed.

## What It Looks Like
The form shows `0`, `NaN`, or an unexpected selling price.

## Fix
Check `originalPrice` and `discountPercentage`, then confirm the formula:

```text
sellingPrice = originalPrice - (originalPrice * discountPercentage / 100)
```

## Prevention
Always convert price fields with `Number()` before calculating.

## Error
Subcategory dropdown is empty

## Why It Happened
No category is selected, or the category name does not match `categoryData.js`.

## What It Looks Like
The subcategory field is disabled or has no options.

## Fix
Select a valid category first. If you added a new category, add its subcategories too.

## Prevention
Keep categories and subcategories in one shared list.

## Error
Multiple image upload fails

## Why It Happened
The frontend field name does not match the backend Multer field name.

## What It Looks Like
`Please upload at least one image file.`

## Fix
The frontend must append files using `images`, and the backend route must use `upload.array("images", 8)`.

## Prevention
Keep FormData field names exactly the same on frontend and backend.

## Error
Product saves without images

## Why It Happened
Cloudinary upload failed or the returned `imageUrls` array was not added to form state.

## What It Looks Like
`At least one product image is required.`

## Fix
Upload again and confirm image previews appear before submitting the product.

## Prevention
Do not submit the product form until the image preview list has at least one image.

## Error
Out-of-stock product reaches checkout

## Why It Happened
Old cart data in localStorage still has an unavailable product, or someone called the API manually.

## What It Looks Like
`Product name is out of stock.`

## Fix
Remove the product from the cart. If testing with API tools, check the product's `stockQuantity`.

## Prevention
Block checkout in both places: frontend cart/checkout pages and backend checkout controller.

## Error
Stock does not reduce after order

## Why It Happened
Payment was not verified, Stripe test keys are missing, or the same unpaid order was not completed.

## What It Looks Like
The order exists, but product `stockQuantity` stays the same.

## Fix
Complete Stripe test payment and make sure `/api/orders/verify-payment` receives the Stripe `sessionId`.

## Prevention
Reduce stock only after payment success, and check `order.isPaid` so stock is not reduced twice.
