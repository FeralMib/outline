// @flow
import React from 'react';
import Icon from './Icon';
import type { Props } from './Icon';

export default function SearchIcon(props: Props) {
  return (
    <Icon {...props}>
      <svg
        fill="#000000"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1692714,14.047951 L19.0606602,16.9393398 C19.6464466,17.5251263 19.6464466,18.4748737 19.0606602,19.0606602 C18.4748737,19.6464466 17.5251263,19.6464466 16.9393398,19.0606602 L14.047951,16.1692714 C13.1546811,16.6971059 12.1127129,17 11,17 C7.6862915,17 5,14.3137085 5,11 C5,7.6862915 7.6862915,5 11,5 C14.3137085,5 17,7.6862915 17,11 C17,12.1127129 16.6971059,13.1546811 16.1692714,14.047951 Z M11,8 C9.34314575,8 8,9.34314575 8,11 C8,12.6568542 9.34314575,14 11,14 C12.6568542,14 14,12.6568542 14,11 C14,9.34314575 12.6568542,8 11,8 Z" />
      </svg>
    </Icon>
  );
}
