import { render, screen } from './test/test-utils';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

it('renders ReleasePlanner via routes', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByRole('button', { name: /expand all/i })).toBeInTheDocument();
});
