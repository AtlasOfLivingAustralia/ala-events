import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Config, ConfigProvider } from '@/contexts/config';

type Props = {
  config: Config;
  children: React.ReactNode;
  helmetContext?: {};
};

export function Root({ config, helmetContext, children }: Props) {
  return (
    <React.StrictMode>
      <ConfigProvider config={config}>
        <HelmetProvider context={helmetContext}>
          <Helmet>
            <title>{config.defaultTitle}</title>
          </Helmet>
          {children}
        </HelmetProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}