// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';

import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it } from 'vitest';

import { FormModal } from './FormModal';
import { makeStore } from '@/app/store';
import ModalRoot from '@/features/modal/ModalRoot';
import { diamondGraph, formNode } from '@/test/graph-fixture';

afterEach(cleanup);

/**
 * Render Form D's modal against a fresh store, with `ModalRoot` mounted so the
 * source-picker sub-modal can open. Returns the store for asserting global state.
 */
function renderFormModal() {
  const store = makeStore();
  const node = formNode(diamondGraph, 'form-d');

  render(
    <Provider store={store}>
      <FormModal graph={diamondGraph} node={node} />
      <ModalRoot />
    </Provider>
  );

  return { store, user: userEvent.setup() };
}

describe('FormModal flows', () => {
  it('commits submitted form values to global state', async () => {
    const { store, user } = renderFormModal();

    await user.type(screen.getByPlaceholderText('email'), 'ada@avantos.dev');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(store.getState().form.formData['form-d']).toMatchObject({
      email: 'ada@avantos.dev',
    });
  });

  it('enabling the prefill toggle swaps form inputs for prefill field rows', async () => {
    const { user } = renderFormModal();

    // Form-entry mode: the email input is present.
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();

    await user.click(screen.getByRole('switch'));

    // Prefill mode: inputs are gone, one selectable row per field.
    expect(screen.queryByPlaceholderText('email')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'dynamic_checkbox_group' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'email' })).toBeInTheDocument();
  });

  it('selecting a source maps the field and shows it back in the form modal', async () => {
    const { store, user } = renderFormModal();

    await user.click(screen.getByRole('switch'));
    // Open the picker for the `email` field.
    await user.click(screen.getByRole('button', { name: 'email' }));

    // Pick Form A's `email` from its group in the source picker sub-modal.
    const formAGroup = (await screen.findByText('Form A')).closest(
      '.prefill-source'
    ) as HTMLElement;
    await user.click(within(formAGroup).getByRole('button', { name: 'email' }));

    // The mapping is persisted to global state...
    expect(store.getState().prefill.mappings['form-d'].email).toMatchObject({
      type: 'form-field',
      sourceNodeId: 'form-a',
      sourceFieldKey: 'email',
      label: 'Form A.email',
    });
    // ...and reflected in the form modal as the field's source.
    expect(await screen.findByText('Form A.email')).toBeInTheDocument();
  });
});
