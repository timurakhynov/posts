import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import NotFoundPage from "./containers/NotFoundPage/NotFoundPage";
import PostsPage from "./containers/PostsPage/PostsPage";
import PrivateRoute from "./utils/PrivateRoute";
import LoginPage from "./components/Login/LoginPage";
import RegisterPage from "./components/Register/RegisterPage";
import AddPostPage from "./containers/AddPostPage/AddPostPage";
import DetailedPostPage from "./containers/DetailedPostPage/DetailedPostPage";

const App = () => {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PostsPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<DetailedPostPage/>} />
        <Route element={<PrivateRoute />}>
          <Route path="/add-post" element={<AddPostPage/>} />
        </Route>
        <Route path={"/login"} element={<LoginPage/>} />
        <Route path={"/register"} element={<RegisterPage/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
};

export default App;