# **Frontend Setup (Vue + Vite)**

This is the frontend for the e-commerce project built using Vue.js 3, Vite, and TailwindCSS. This guide will help you set up, configure, and run the project locally.


## **Prerequisites**
* Make sure you have the following installed:

    * Node.js (version >= 14)
    * npm (version >= 6)
    * A valid Stripe account for payment processing
## Installation Steps


1. Clone the repository:

```bash
git clone https://github.com/mohamedkhattab2019/ecommerce-frontend.git
cd ecommerce-frontend
```
2. Install dependencies:
```bash
npm install
```
3. Environment Configuration:

Create a .env file in the root of the project with the following variables:

Replace the VITE_API_BASE_URL with your backend URL and VITE_STRIPE_PUBLIC_KEY with your Stripe public key.
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_51QPCm1Li27LSE7TsegbiJ5AgVhLK55jSTsDWzb2oUMOdkIFj14tEFYRX8KxPWUMno6vfXv2L4kVrEszgNBfnok8t00u8lEL6Bt
```

3. Update the config.js:

Inside the src/config.js file, add:
```
export const TAX_PERCENTAGE = 10;
```
4. Running the Project
* Start the development server:

```bash
npm run dev
```
The application will run on http://localhost:5173 by default.

5. Build for production:

To create a production-ready build:

```bash
npm run build
```
The production files will be available in the dist folder.

5. Preview the production build:

```bash
npm run preview
```