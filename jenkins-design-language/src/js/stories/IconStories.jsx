import React from 'react';
import { storiesOf } from '@kadira/storybook';

import { Icon } from '../components/Icon';
import * as IconId from '@jenkins-cd/blueocean-material-icons';

/* eslint-disable max-len, react/self-closing-comp */

storiesOf('Icon', module)
    .add('all icons', AllIcons)
    .add('vertical positioning', VerticalPositioning)
    .add('sizing', Sizing)
;

const style = {
    padding: 10,
};

const iconStyle = {
    fill: "#4A90E2",
};

function AllIcons() {
    return (
        <div>
            <div style={style}> 
                <h1>Material-UI-Icons</h1>

                <div style={{ display: 'flex', flexFlow: 'row wrap', marginTop: '20px' }}>
                    { Object.keys(IconId).sort().map(shape => (
                        <div key={shape} style={{marginTop: '20px', textAlign: 'center', width: '19%'}}>
                            <Icon icon={shape} style={iconStyle} />
                            <div>{shape}</div>
                        </div>
                    ) )}
                </div>
            </div>
        </div>
    );
}

function VerticalPositioning() {
    return (
        <div>
            <div style={style}> 
                <h1>Material-UI-Icons</h1>

                <p style={{ margin: '60px 0 0', fontWeight: 'bold' }}>
                    Vertical Align Middle
                </p>

                <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
                    { Object.keys(IconId).slice(50, 75).sort().map(shape => (
                        <div key={shape} style={{marginTop: '20px', width: '19%'}}>
                            <Icon icon={shape} style={iconStyle} />
                            <span> {shape}</span>
                        </div>
                    ) )}
                </div>

                <p style={{ margin: '60px 0 0', fontWeight: 'bold' }}>
                    Vertical Align Bottom
                </p>
                <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
                    { Object.keys(IconId).slice(50, 75).sort().map(shape => (
                        <div key={shape} style={{marginTop: '20px', width: '19%'}}>
                            <Icon icon={shape} style={{verticalAlign: 'bottom', fill: "#4A90E2"}} />
                            <span> {shape}</span>
                        </div>
                    ) )}
                </div>
                
            </div>
        </div>
    );
}

const buttonRow = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10
};

function Sizing() {
    const cellStyle = {...buttonRow, marginBottom: 0};

    return (
        <div style={style}>
            { Object.keys(IconId).slice(50, 60).sort().map(shape => (
            <div key={shape} style={buttonRow}>
                <div className="layout-small" style={cellStyle}>
                    Small &nbsp;
                    <Icon icon={shape} style={iconStyle} label="Small" />
                </div>
                <div style={cellStyle}>
                    Medium &nbsp;
                    <Icon icon={shape} style={iconStyle} label="Medium" />
                </div>
                <div className="layout-large" style={cellStyle}>
                    Large &nbsp;
                    <Icon icon={shape} style={iconStyle} label="Large" />
                </div>
            </div>
            )) }
        </div>
    );
}
