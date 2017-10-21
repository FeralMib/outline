// @flow
import React from 'react';
import Icon from './Icon';
import type { Props } from './Icon';

export default function CloseIcon(props: Props) {
  return (
    <Icon {...props}>
      <svg
        fill="#000000"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12,10.5857864 L8.70710678,7.29289322 C8.31658249,6.90236893 7.68341751,6.90236893 7.29289322,7.29289322 C6.90236893,7.68341751 6.90236893,8.31658249 7.29289322,8.70710678 L10.5857864,12 L7.29289322,15.2928932 C6.90236893,15.6834175 6.90236893,16.3165825 7.29289322,16.7071068 C7.68341751,17.0976311 8.31658249,17.0976311 8.70710678,16.7071068 L12,13.4142136 L15.2928932,16.7071068 C15.6834175,17.0976311 16.3165825,17.0976311 16.7071068,16.7071068 C17.0976311,16.3165825 17.0976311,15.6834175 16.7071068,15.2928932 L13.4142136,12 L16.7071068,8.70710678 C17.0976311,8.31658249 17.0976311,7.68341751 16.7071068,7.29289322 C16.3165825,6.90236893 15.6834175,6.90236893 15.2928932,7.29289322 L12,10.5857864 Z"
          id="path-1"
        />
      </svg>
    </Icon>
  );
}
