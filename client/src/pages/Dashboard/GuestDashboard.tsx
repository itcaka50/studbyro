import React from 'react';

export const GuestDashboard = () => {
    return (
        <div>
            <h1>Добре дошли в Университетската система</h1>
            <p>Разгледайте нашата структура (публичен достъп):</p>

            <div style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
                <div className="card">Факултети</div>
                <div className="card">Катедри</div>
                <div className="card">Курсове</div>
                <div className="card">Преподаватели</div>
            </div>
        </div>
    );
};
