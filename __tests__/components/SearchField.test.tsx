import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchField } from '@/app/_components/SearchField';

describe('SearchField', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders an input with the correct placeholder', () => {
    render(<SearchField onSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onSearch with the input value after debounce', async () => {
    const onSearch = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchField onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText('Search...'), 'Job');
    expect(onSearch).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(onSearch).toHaveBeenCalledWith('Job');
  });

  it('does not call onSearch before debounce delay', async () => {
    const onSearch = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SearchField onSearch={onSearch} />);
    await user.type(screen.getByPlaceholderText('Search...'), 'nat');

    jest.advanceTimersByTime(400);
    expect(onSearch).not.toHaveBeenCalled();
  });
});
