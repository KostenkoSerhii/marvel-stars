import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import {MainPage, ComicsPage, SingleComicPage} from "../pages";

const App = () => {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route path="/comics" element={ <ComicsPage />}>
							{/* TODO: fix single comic route  */}
						<Route path=":comicId" element={<SingleComicPage />}/>
						</Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
};
 
export default App;
