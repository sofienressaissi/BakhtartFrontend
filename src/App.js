import './App.css';
import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Axios from "axios";
import { useLoading, BallTriangle } from '@agney/react-loading';
import UserContext from './context/UserContext';

const HomeView = lazy(() => import("./pages/homepage"));
const LoginView = lazy(() => import("./pages/login"));
const RegisterView = lazy(() => import("./pages/register"));
const ForgetPassView = lazy(() => import("./pages/forget-password"));
const AccountView = lazy(() => import("./pages/account"));
const EditAccountView = lazy(()=> import("./pages/edit-profile"));
const ProdsSingleCatView = lazy(()=> import("./pages/prods-single-category"));
const ProdsInSaleView = lazy(()=> import("./pages/prods-in-sale"));
const ProdsOutOfStockView = lazy(()=> import("./pages/prods-out-of-stock"));
const ProdsSingleDetailView = lazy(()=> import("./pages/prod-detail"));
const CartBakhtView = lazy(()=> import("./pages/cartBakht"));
const CheckoutBakhtView = lazy(()=> import("./pages/checkoutBakht"));
const MyOrdersView = lazy(()=> import("./pages/my-orders"));
const MyWishlistView = lazy(()=> import("./pages/my-wishlist"));
const SeenRecentlyView = lazy(()=> import("./pages/seen-recently"));
const ResetPasswordView = lazy(()=> import("./pages/change-password"));
const DashboardAdminBakht = lazy(()=> import("./dashboard/dashboardHome"));
const AllUsersBakht = lazy(()=> import("./dashboard/allUsers"));
const AllProdsBakht = lazy(()=> import("./dashboard/allProducts"));
const AllOrdersBakht = lazy(()=> import("./dashboard/allOrders"));
const AllCatsBakht = lazy(()=> import("./dashboard/allCategories"));
const CurrentProdsBakht = lazy(()=> import("./dashboard/currentProducts"));
const OutOfStockProdsBakht = lazy(()=> import("./dashboard/outOfStockProducts"));
const DeactivatedUsersBakht = lazy(()=> import("./dashboard/deactivatedUsers"));
const UnverifiedUsersBakht = lazy(()=> import("./dashboard/unverifiedUsers"));
const AddNewUserBakht = lazy(()=> import("./dashboard/add-new-user"));
const EditAccountBakht = lazy(()=> import("./dashboard/editAccount"));
const AddCategoryBakht = lazy(()=> import("./dashboard/addCategory"));
const AddProductBakht = lazy(()=> import("./dashboard/addProduct"));
const MessagesBakht = lazy(() => import("./dashboard/messages"));

function App() {

  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <BallTriangle width="50" color="#070C29"/>,
  });

  const [userrData, setUserrData] = useState({
    token: undefined,
    userr: undefined
});

  useEffect(() => {
    const checkLoggedIn = async () => {
    let token = localStorage.getItem("auth-token");
    if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
    }
    const tokenRes = await Axios.post(
        "https://bakhtart-backend.herokuapp.com/fashion/tokenIsValid", 
        null, {headers: {"x-auth-token": token}}
    );
    if (tokenRes.data) {
        const userrRes = await Axios.get("https://bakhtart-backend.herokuapp.com/fashion/",
            {headers: {"x-auth-token": token},
        });
        setUserrData({
            token,
            userr: userrRes.data
        })
    }
    }
    checkLoggedIn();
}, []);

  return ( 
  <>
  <BrowserRouter> 
  <UserContext.Provider value={{userrData, setUserrData}}>
  <React.Fragment>
  <Suspense fallback={
     <div align = "center">
     <section {...containerProps}>{indicatorEl}</section></div>}>
  <Switch>
    <Route exact path="/" component={HomeView} />
    <Route exact path = "/cart" component = {CartBakhtView} />
    <Route exact path = "/checkout/:orderNumber" component = {CheckoutBakhtView} />
    <Route exact path="/login" component={LoginView} />
    <Route exact path="/register" component={RegisterView} />
    <Route exact path="/forget-password" component={ForgetPassView} />
    <Route exact path="/account" component={AccountView} />
    <Route exact path="/account/edit" component={EditAccountView}/>
    <Route exact path="/account/change-password" component={ResetPasswordView}/>
    <Route exact path="/my-orders" component={MyOrdersView}/>
    <Route exact path="/my-wishlist" component={MyWishlistView}/>
    <Route exact path="/seen-recently" component={SeenRecentlyView}/>
    <Route exact path="/products/:categoryname" component={ProdsSingleCatView}/>
    <Route exact path="/products/in-sale/:categoryname" component={ProdsInSaleView}/>
    <Route exact path="/products/out-of-stock/:categoryname" component={ProdsOutOfStockView}/>
    <Route exact path="/products/:categoryname/:productname" component={ProdsSingleDetailView}/>
    <Route exact path="/admin/add-category" component={AddCategoryBakht} />
    <Route exact path="/admin/add-product" component={AddProductBakht} />
    <Route exact path="/admin/add-new-user" component={AddNewUserBakht} />
    <Route exact path="/admin/edit-account" component={EditAccountBakht} />
    <Route exact path="/admin/all-users" component={AllUsersBakht} />
    <Route exact path="/admin/all-products" component={AllProdsBakht} />
    <Route exact path="/admin/all-orders" component={AllOrdersBakht} />
    <Route exact path="/admin/all-categories" component={AllCatsBakht} />
    <Route exact path="/admin/current-products" component={CurrentProdsBakht} />
    <Route exact path="/admin/out-of-stock-products" component={OutOfStockProdsBakht} />
    <Route exact path="/admin/deactivated-users" component={DeactivatedUsersBakht} />
    <Route exact path="/admin/unverified-users" component={UnverifiedUsersBakht} />
    <Route exact path="/admin/messages" component={MessagesBakht} />
    <Route exact path="/admin" component={DashboardAdminBakht} />

    <Route component={() => (
      <html>
        <head>
          <title>Not Found!</title>
        </head>
        <body>
        <div align = "center">
          </div>
          
        </body>
        <div align = "center">
          <br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <br/><br/>
          <span style={{color: '#D3BE06', fontFamily: 'Felix Titling'}}>BAKHT</span>
          <img src={`https://bakhtart.herokuapp.com/assets/images/logoBakhtSiren.png`} alt="BakhtArt Logo"/>
          <span style={{color: '#D3BE06', fontFamily: 'Felix Titling'}}>ART</span><br/>
          <h2 style={{color: '#D3BE06', fontFamily: 'Felix Titling'}}>404 Not Found!</h2><br/>
        </div>
        <style>
        {document.body.style.backgroundColor = "#070C29"}
        </style>
      </html>
    
    )} />
  </Switch>
  </Suspense>
  </React.Fragment>
  </UserContext.Provider>
  </BrowserRouter>
  </>
)
}

export default App;
