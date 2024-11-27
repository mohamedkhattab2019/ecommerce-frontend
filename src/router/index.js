import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/Layout.vue";
import Categories from "../pages/Categories.vue";
import Products from "../pages/Products.vue";
import Cart from "../pages/Cart.vue";
import Checkout from "../pages/Checkout.vue";
import OrderConfirmation from "../pages/OrderConfirmation.vue";
import AdminCategoryPage from "../pages/Admin/AdminCategoryPage.vue";
import AdminProductsPage from "../pages/Admin/AdminProductsPage.vue";
import OrderFailure from "../pages/OrderFailure.vue";
import ProductDetails from "../pages/ProductDetails.vue";
import UserOrders from "../pages/UserOrders.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "Categories",
        component: Categories,
      },
      {
        path: "categories",
        name: "CategoriesList",
        component: Categories,
      },
      {
        path: "categories/:categoryId/products",
        name: "Products",
        component: Products,
        props: true, // Pass categoryId as a prop
      },
      {
        path: "/products/:productId",
        name: "ProductsDetails",
        component: ProductDetails,
        props: true, // Pass categoryId as a prop
      },
      {
        path: "admin/categories",
        name: "AdminCategories",
        component: AdminCategoryPage,
        props: true, // Pass categoryId as a prop
      },
      {
        path: "/admin/categories/:categoryId/products",
        name: "AdminProducts",
        component: AdminProductsPage,
        props: true, // Pass categoryId as a prop
      },
      { path: "cart", name: "Cart", component: Cart },
      { path: '/checkout', name: 'Checkout', component: Checkout },
      { path: '/order-confirmation/:orderId', name: 'OrderConfirmation', component: OrderConfirmation, props: true },
      { path: '/order-failure', name: 'OrderFailure', component: OrderFailure },
      { path: '/orders', name: 'UserOrders', component: UserOrders },



    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
