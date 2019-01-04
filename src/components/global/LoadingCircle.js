import React from 'react'
import { translate } from 'admin-on-rest'
import { themes } from '../../properties'

export const LoadingCircle = (props) => {
  const { title, theme } = props
  return <div className='LoadingCircle_wrapper'>
    <div className='LoadingCircle_inner'>
      <svg version='1.1' id='LoadingCircle_svg2'
        style={{ filter: 'drop-shadow(0 0px 2px ' + themes[theme].foreColors[0] + ')' }}
        className='LoadingCircle_rotate' width='40%' height='40%' viewBox='0 0 4220 4220'
        preserveAspectRatio='xMidYMid meet'>
        <g id='LoadingCircle_g_logoCircle' style={{ fill: themes[theme].backColors[0] }} stroke='none'>
          <path
            d='M1411 4211 c-12 -8 12 -98 133 -512 81 -276 145 -507 142 -514 -2 -6 -26 -20 -53 -30 -87 -32 -225 -108 -302 -165 -213 -159 -351 -374 -412 -645 -20 -87 -18 -410 2 -492 l16 -62 -221 -79 c-122 -44 -332 -119 -468 -168 -226 -81 -248 -91 -248 -112 0 -12 6 -25 13 -28 7 -2 221 56 475 131 254 74 468 135 475 135 6 0 27 -31 45 -68 54 -112 131 -221 227 -317 288 -289 694 -403 1096 -307 l76 19 179 -499 c163 -455 180 -498 201 -498 12 0 25 5 28 10 4 6 -59 235 -139 509 -80 275 -146 503 -146 507 0 5 48 31 108 59 332 154 547 390 638 700 39 134 45 348 14 495 -13 58 -23 113 -24 123 -1 16 76 46 477 190 353 126 477 175 477 186 -1 49 2 50 -512 -101 l-493 -144 -42 83 c-177 352 -527 593 -921 631 -96 10 -295 0 -367 -18 -22 -5 -47 -10 -56 -10 -12 0 -59 121 -195 500 -181 506 -185 515 -223 491z m922 -1134 c229 -74 404 -255 522 -541 20 -49 33 -92 28 -96 -17 -14 -706 -211 -713 -203 -9 9 -300 819 -300 833 0 4 35 15 78 24 113 23 284 15 385 -17z m-464 -486 c67 -228 118 -418 114 -422 -7 -5 -708 -259 -717 -259 -13 0 -28 216 -23 326 9 235 83 426 227 587 72 81 254 208 271 189 4 -4 61 -194 128 -421z m1079 -352 c22 -89 27 -350 9 -444 -39 -205 -141 -379 -301 -508 -55 -46 -164 -112 -171 -105 -10 10 -255 861 -249 867 10 10 678 249 689 247 5 -2 16 -27 23 -57z m-743 -679 c113 -316 149 -427 140 -432 -34 -20 -205 -40 -295 -35 -119 7 -192 26 -300 78 -72 35 -100 57 -185 143 -70 70 -113 125 -145 180 -43 77 -105 222 -112 260 -3 17 37 31 362 127 201 59 369 107 374 105 5 -1 77 -193 161 -426z' />
        </g>
      </svg>
      <div className='LoadingCircle_loading' style={{ color: 'rgba(56, 59, 50, 0.5)' }}>loading...</div>
    </div>
  </div>
}
// {props.title || }
