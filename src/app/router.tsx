import { AnimatePresence } from 'framer-motion';
import Home from '../screens/Home';
import Map from '../screens/Map';        // next to build
import Partner from '../screens/Partner';
import ConfirmPayment from '../screens/ConfirmPayment';
import PoiCard from '../screens/PoiCard';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';

type Screen = 'home' | 'map' | 'partner' | 'confirm-payment' | 'poi-card';

type StackItem = {
  screen: Screen;
  payload?: any;
};

type RouterContextType = {
  stack: StackItem[];
  push: (screen: Screen, payload?: any) => void;
  pop: () => void;
  replace: (screen: Screen, payload?: any) => void;
  payload?: any;
};
const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<StackItem[]>([{ screen: 'home' }]);
  
  useEffect(() => {
    console.log('Router stack:', stack);
    (window as any).__router_stack = stack;
  }, [stack]);

  const push = (screen: Screen, payload?: any) => {
    setStack((s) => [...s, { screen, payload }]);
  };

  const pop = () => {
    console.log('POP called, current length:', stack.length);
    setStack((s) => {
      const newStack = s.length > 1 ? s.slice(0, -1) : s;
      console.log('POP result, new length:', newStack.length);
      return newStack;
    });
  };

  const replace = (screen: Screen, payload?: any) => {
    setStack((s) => [...s.slice(0, -1), { screen, payload }]);
  };

  const ctx: RouterContextType = {
    stack,
    push,
    pop,
    replace,
    payload: stack[stack.length - 1]?.payload,
  };

  // src/app/router.tsx  (add inside RouterProvider)
  return (
    <RouterContext.Provider value={ctx}>
      {/* ------  stack renderer  ------ */}
      <AnimatePresence>
        {stack.map((item, idx) => {
          const isTop = idx === stack.length - 1;

          switch (item.screen) {
            case 'home':
              return isTop && <Home key={`home-${idx}`} />;
            case 'partner':
              return isTop && <Partner key={`partner-${idx}`} />;
            case 'confirm-payment':
              return isTop && (
                <ConfirmPayment key={`payment-${idx}`} value={item.payload?.value} />
              );
            case 'poi-card':
              return isTop && <PoiCard key={`poi-${idx}`} />;
            default:
              return null; // no duplicate Home fallback
          }
        })}
      </AnimatePresence>

      {/* Map lives forever, only query changes */}
      <Map query={stack.at(-1)?.payload?.query} />
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider');
  return ctx;
};