import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRouter from "./components/PrivateRouter";
import Listing from './pages/Listing';
import UpdateList from './pages/UpdateList';
import ListingUI from "./pages/ListingUI";
import Search from "./pages/Search";
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="listing/:listId" element={<ListingUI />} />
        <Route path="search" element={<Search />} />
        <Route element={<PrivateRouter />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="create-listing" element={<Listing />} />
          <Route path="update-listing/:listId" element={<UpdateList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
