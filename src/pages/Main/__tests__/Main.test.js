import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppStateContext from '../../../context/AppStateContext';
import Main from '../Main';

const mockAppStateContextValue = {
    state: {}, 
    fetchCustomers: jest.fn(),
};

test('renders GridOverview component', () => {
    render(
        <AppStateContext.Provider value={mockAppStateContextValue}>
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        </AppStateContext.Provider>
    );
    const gridOverviewElement = screen.getByTestId('grid-overview');

    expect(gridOverviewElement).toBeInTheDocument();
});
