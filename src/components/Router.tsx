import DealerApplicationPage from '@/components/pages/DealerApplicationPage';
import DealerSurveyPage from '@/components/pages/DealerSurveyPage';
import HomePage from '@/components/pages/HomePage';
import { MemberProvider } from '@/integrations';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: 'dealer-application',
        element: <DealerApplicationPage />,
      },
      {
        path: 'dealer-survey',
        element: <DealerSurveyPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
