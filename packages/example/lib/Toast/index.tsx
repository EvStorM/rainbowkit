import React from 'react';
import { ReactComponent as Notification } from './icons/Notification.svg';
import { ReactComponent as Error } from './icons/icon_error.svg';
import { ReactComponent as Success } from './icons/icon_success.svg';
import { ReactComponent as Warning } from './icons/icon_warning.svg';
import { Toaster } from './src';

interface DMToastProps {
  intl?: any;
}

const IconBese = (props: any) => {
  return (
    <div
      style={{
        width: '24px',
        height: '24px',
        minWidth: '24px',
        flex: '0 0 24px',
        minHeight: '24px',
      }}
    >
      {props.children}
    </div>
  );
};

const DMToast = (props: DMToastProps) => {
  return (
    <Toaster
      intl={props.intl || null}
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 2000,
        style: {
          background: '#fff',
          color: '#3e3e3e',
          borderRadius: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        },
        // Default options for specific types
        success: {
          icon: (
            <IconBese>
              <Success width={24} height={24} />
            </IconBese>
          ),
        },
        successCode: {
          icon: (
            <IconBese>
              <Success width={24} height={24} />
            </IconBese>
          ),
        },
        error: {
          icon: (
            <IconBese>
              <Error width={24} height={24} />
            </IconBese>
          ),
        },
        errorCode: {
          icon: (
            <IconBese>
              <Error width={24} height={24} />
            </IconBese>
          ),
        },
        custom: {
          icon: (
            <IconBese>
              <Warning width={24} height={24} />
            </IconBese>
          ),
        },
        warning: {
          icon: (
            <IconBese>
              <Warning width={24} height={24} />
            </IconBese>
          ),
        },
        blank: {
          icon: (
            <IconBese>
              <Notification width={24} height={24} />
            </IconBese>
          ),
        },
      }}
    />
  );
};

export default DMToast;
