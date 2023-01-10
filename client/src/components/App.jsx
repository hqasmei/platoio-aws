import React, { useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom"

import { useLocalStorage, writeStorage } from "@rehooks/local-storage"
import { QueryClient, QueryClientProvider } from "react-query"
import { Login } from "./Login"
import { Register } from "./Register"
import { Dashboard } from "./Dashboard"
import { NotFound } from "./NotFound"

import * as api from "../api.js"
import * as constants from "../constants"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Do not retry on errors.
      refetchInterval: constants.REFETCH_INTERVAL, // Requery the server every REFETCH_INTERVAL, by default.
      staleTime: Infinity, // Never consider cached data as stale. This means all mutations require an explicit 'invalidateQuery' call!
    },
  },
})

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path={constants.ROUTE_REGISTER} element={<Register />} />
            <Route path={constants.ROUTE_LOGIN} element={<Login />} />
            <Route exact path={constants.ROUTE_HOME} element={<Dashboard />} />
            <Route exact path={constants.ROUTE_HOME} element={<PrivateRoute />}>
              <Route
                exact
                path={constants.ROUTE_HOME}
                element={<Dashboard />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  )
}

const PrivateRoute = () => {
  const location = useLocation()
  useEffect(() => {
    writeStorage(constants.SESSION_KEY_ROUTE, location.pathname)
  }, [location])

  const [user] = useLocalStorage(constants.SESSION_KEY_USER)

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return api.userLooksValid(user) ? (
    <Outlet />
  ) : (
    <Navigate to={constants.ROUTE_LOGIN} />
  )
}

export default App
