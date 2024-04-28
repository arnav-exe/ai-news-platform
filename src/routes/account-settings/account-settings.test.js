// account-settings.test.js

import { render, fireEvent } from '@testing-library/svelte';
import { getToastStore } from "@skeletonlabs/skeleton";
import AccountSettings from './+page.svelte';

// Manually mock authHandlers
const mockUpdateEmail = jest.fn();
const mockUpdatePassword = jest.fn();
jest.mock('../../path/to/authHandlers', () => ({
  updateEmail: mockUpdateEmail,
  updatePassword: mockUpdatePassword
}));

// Manually mock toastStore
const mockTrigger = jest.fn();
jest.mock('@skeletonlabs/skeleton', () => ({
  getToastStore: () => ({
    trigger: mockTrigger
  })
}));

describe('AccountSettings component', () => {
  it('updates email when submit button is clicked', async () => {
    // Render the component
    const { getByPlaceholderText, getByText } = render(AccountSettings);

    // Simulate user input
    const emailInput = getByPlaceholderText('update email');
    await fireEvent.input(emailInput, { target: { value: 'newemail@example.com' } });

    // Click submit button
    const submitButton = getByText('Submit');
    await fireEvent.click(submitButton);

    // Assert that updateEmail function is called with the correct argument
    expect(mockUpdateEmail).toHaveBeenCalledWith('newemail@example.com');

    // Assert that toastStore.trigger is called with the correct data
    expect(mockTrigger).toHaveBeenCalledWith({
      message: 'Updated successfully!',
      timeout: 5000,
      background: 'variant-filled-success'
    });
  });

  // Write similar tests for updating password and rendering behavior
});
