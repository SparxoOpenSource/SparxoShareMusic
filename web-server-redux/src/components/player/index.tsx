import * as React from 'react';

import './player.css';

interface IPlayerProps extends React.Props<any> {
    text:string;
};

export default function Player({text}: IPlayerProps) {      
    return <div className="player">player {text}</div>;
}