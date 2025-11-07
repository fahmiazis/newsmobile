/* eslint-disable prettier/prettier */
import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (!navigationRef.current) return;

  const state = navigationRef.current.getRootState();

  // ✅ Daftar mapping child -> parent
  const childToParent = {
    PurchDisposal: 'Disposal',
    // tambahin mapping lain kalau ada
  };

  if (childToParent[name]) {
    const parent = childToParent[name];

    // cek kalau parent sudah ada di stack
    const parentExists = state?.routes?.some(r => r.name === parent);

    if (parentExists) {
      // langsung navigate ke child di dalam parent
      navigationRef.current.navigate(parent, {
        screen: name,
        params,
      });
    } else {
      // parent belum ada, navigate biasa
      navigationRef.current.navigate(parent, {
        screen: name,
        params,
      });
    }
    return;
  }

  // default navigate
  navigationRef.current.navigate(name, params);
}

// versi functional wrapper
export function AppNavigationContainer({ children }) {
  const navRef = useRef(null);

  return (
    <NavigationContainer
      ref={(ref) => {
        navigationRef.current = ref; // sinkronisasi ke global
        navRef.current = ref;
      }}
    >
      {children}
    </NavigationContainer>
  );
}
