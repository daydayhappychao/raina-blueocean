import React from 'react';

export class Sites extends React.Component {
    render() {
        return (
            <div style={{ height: 'calc(100vh - 170px)' }}>
                <iframe src="http://manage.rainadev.tech/list" width="100%" height="100%" style={{ border: 'none' }} />
            </div>
        );
    }
}

export default Sites;
