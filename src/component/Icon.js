import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';
import * as imgs from '../../public/index';

export default function Icon({ name, color = "black", style = {} }) {
    const source = useRef(imgs[`${name}_${color}`]).current
    return (
        <Image style={style} source={source || null} />
    )
}