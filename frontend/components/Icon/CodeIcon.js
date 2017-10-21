// @flow
import React from 'react';
import Icon from './Icon';
import type { Props } from './Icon';

export default function CodeIcon(props: Props) {
  return (
    <Icon {...props}>
      <svg
        fill="#000000"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.9805807,17.1961161 C11.8722687,17.7376759 11.3454436,18.0888926 10.8038839,17.9805807 C10.2623241,17.8722687 9.91110737,17.3454436 10.0194193,16.8038839 L12.0194193,6.80388386 C12.1277313,6.26232411 12.6545564,5.91110737 13.1961161,6.01941932 C13.7376759,6.12773127 14.0888926,6.65455638 13.9805807,7.19611614 L11.9805807,17.1961161 Z M6.41421356,12 L8.70710678,14.2928932 C9.09763107,14.6834175 9.09763107,15.3165825 8.70710678,15.7071068 C8.31658249,16.0976311 7.68341751,16.0976311 7.29289322,15.7071068 L4.29289322,12.7071068 C3.90236893,12.3165825 3.90236893,11.6834175 4.29289322,11.2928932 L7.29289322,8.29289322 C7.68341751,7.90236893 8.31658249,7.90236893 8.70710678,8.29289322 C9.09763107,8.68341751 9.09763107,9.31658249 8.70710678,9.70710678 L6.41421356,12 Z M15.2928932,14.2928932 L17.5857864,12 L15.2928932,9.70710678 C14.9023689,9.31658249 14.9023689,8.68341751 15.2928932,8.29289322 C15.6834175,7.90236893 16.3165825,7.90236893 16.7071068,8.29289322 L19.7071068,11.2928932 C20.0976311,11.6834175 20.0976311,12.3165825 19.7071068,12.7071068 L16.7071068,15.7071068 C16.3165825,16.0976311 15.6834175,16.0976311 15.2928932,15.7071068 C14.9023689,15.3165825 14.9023689,14.6834175 15.2928932,14.2928932 Z" />
        {' '}
      </svg>
    </Icon>
  );
}
